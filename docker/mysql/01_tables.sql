use db;

CREATE TABLE Routes (
                        Route_id int NOT NULL AUTO_INCREMENT,
                        Location varchar(255),
                        Length int,
                        Elevation int,
                        Circle boolean,
                        PRIMARY KEY (Route_id)
);

