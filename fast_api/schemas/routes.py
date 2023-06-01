from typing import Annotated

from fastapi import Query
from pydantic import BaseModel, Field


class CreateRoute(BaseModel):
    location: str = Field(description="Name of the route.", max_length=255)
    length: int = Field(description="Total length of route in meters", ge=0)
    elevation: int = Field(description="Total elevation of route in meters", ge=0)
    circle: bool = Field(description="Route can be repeated in laps")


class GetRoute(CreateRoute):
    route_id: int

