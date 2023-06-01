from enum import Enum

from fastapi import FastAPI

from .schemas.routes import CreateRoute, GetRoute

app = FastAPI()

SAMPLE_DATA = [{"Hello": "World"},
               {"Hello1": "Hello1"},
               {"Hello2": "Hello2"},
               {"Hello3": "Hello3"},
               {"Hello4": "Hello4"},
               ]


SAMPLE_ONOFF = [
    {'dbhost': 'database1.svale.netledger.com', 'cdb': 'N/A', 'pdbs': 'nkey1, nkey2'},
    {'dbhost': 'database2.svale.netledger.com', 'cdb': 'N/A', 'pdbs': 'nkey3, nkey4'},
    {'dbhost': 'database3.svale.netledger.com', 'cdb': 'N/A', 'pdbs': 'nkey5, nkey6'},
    {'dbhost': 'database4.svale.netledger.com', 'cdb': 'N/A', 'pdbs': 'nkey7, nkey8'},
    {'dbhost': 'database5.svale.netledger.com', 'cdb': 'N/A', 'pdbs': 'nkey9, nkey10'},
]

class SampleName(str, Enum):
    Hello = "World1"
    HELLO2 = "Hello3"


@app.get("/routes/")
async def read_routes(skip: int = 0, limit: int = 10):
    return SAMPLE_DATA[skip: skip + limit]


@app.post("routes/")
async def insert_route(route: CreateRoute):
    return ''


@app.get("/routes/{route_id}")
async def read_route(route_id: SampleName):
    return route_id


@app.get("/onoff/")
async def read_onoff_databases(dbhost: str = None,
                               cdb: str = None,
                               pdbs: str = None):
    if dbhost:
        record = [r for r in SAMPLE_ONOFF if r['dbhost'] == dbhost]
    elif cdb:
        record = [r for r in SAMPLE_ONOFF if r['cdb'] == cdb]
    else:
        record = SAMPLE_ONOFF

    return {'data': record}

