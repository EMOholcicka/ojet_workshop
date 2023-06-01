const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const fs = require("fs-extra");
const fetch = require("node-fetch");

const DATA_PATH = "./data.json";
const ONOFF_DATA_PATH = "./data_onoff.json"

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function restoreData() {
    const jedis = new Set([
        'Luke Skywalker', 'Obi-Wan Kenobi', 'Anakin Skywalker', 'Yoda', 'Qui-Gon Jinn', 'Plo Koon', 'Kit Fisto',
        'Jocasta Nu', 'Owen Lars', 'Mace Windu', 'Eeth Koth', 'Yarael Poof', 'Shaak Ti'
    ]);

    const character_url = (id) => `https://swapi.dev/api/people/${id}/`;

    const homeworlds = {};
    const data = [];

    for (let i = 1; i <= 83; i++) {
        // get character data
        const character = await (await fetch(character_url(i))).json();

        // get homeworld
        let homeworld;
        try {
            const homeworld_url = new URL(character.homeworld);
            if (homeworld_url.href in homeworlds) {
                homeworld = homeworlds[homeworld_url.href].name;
            } else {
                homeworlds[homeworld_url.href] = await (await fetch(homeworld_url.href)).json();
                homeworld = homeworlds[homeworld_url.href].name;
            }
        } catch (e) {}

        data.push({
            Name: character.name,
            Gender: character.gender || "n/a",
            Homeworld: homeworld || "n/a",
            Born: character.birth_year || "n/a",
            Jedi: (jedis.has(character.name)) ? "yes" : "no",
            Created: character.edited
        });
    }

    console.log(data);
    fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

app.get("/restore-data", (req, res) => {
    restoreData();
    res.send("Data are downloading and will be stored to the 'data.json' file as soon as possible.");
});

app.get("/", (req, res) => {
    res.send("API is working...");
});

app.get("/star-wars", (req, res) => {
    const characters = fs.readJsonSync(DATA_PATH);
    const offset = parseInt(req.query.offset || 0);
    const limit = parseInt(req.query.limit || characters.length);

    res.send({
        totalSize: characters.length,
        hasMore: characters.length > offset + limit,
        data: characters.slice(offset, offset + limit)
    });
});

app.get("/star-wars/:name", (req, res) => {
    const found = fs.readJsonSync(DATA_PATH).find(character => character.Name.toLowerCase() === req.params.name.toLowerCase());

    if (found) {
        res.send(found);
    } else {
        res.status(404).send(`Sorry, "${req.params.name}" is not in Star Wars database.`);
    }
});

app.get("/onoff/", (req, res) => {
    const characters = fs.readJsonSync(ONOFF_DATA_PATH);
    const offset = parseInt(req.query.offset || 0);
    const limit = parseInt(req.query.limit || characters.length);

    if (req.query.dbhost) {
        console.log("in condition")
        const found = fs.readJsonSync(ONOFF_DATA_PATH).find(entry => entry.dbhost.toLowerCase() === req.query.dbhost.toLowerCase());

        if (found) {
            res.send({
                data: [found]
            });
        } else {
            res.status(404).send(`Sorry, "${req.params.name}" is not in Star Wars database.`);
        }
    }

    res.send({
        totalSize: characters.length,
        hasMore: characters.length > offset + limit,
        data: characters.slice(offset, offset + limit)
    });
});

app.post("/star-wars", (req, res) => {
    const character = {...req.body};
    character.Created = new Date().toISOString();

    const characters = fs.readJsonSync(DATA_PATH);
    characters.unshift(character);
    fs.writeFile(DATA_PATH, JSON.stringify(characters, null, 2));

    res.send(character);
});

app.put("/star-wars", (req, res) => {
    const characters = fs.readJsonSync(DATA_PATH);

    let index = characters.findIndex(character => character.Name === req.body.Name);
    characters[index] = {...characters[index], ...req.body};

    fs.writeFile(DATA_PATH, JSON.stringify(characters, null, 2));

    res.send(characters[index]);
});

app.delete("/star-wars/:name", (req, res) => {
    const characters = fs.readJsonSync(DATA_PATH);

    let index = characters.findIndex(character => character.Name === req.params.name);
    const removedCharacter = {...characters[index]};
    characters.splice(index, 1);

    fs.writeFile(DATA_PATH, JSON.stringify(characters, null, 2));

    res.send(removedCharacter);
})

const server = app.listen(3333, "localhost", () => {
    console.log(`API is listening at http://${server.address().address}:${server.address().port}`);
});