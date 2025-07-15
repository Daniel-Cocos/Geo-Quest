import base64
import math
import os
import random
from typing import Tuple

import google_streetview.api
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

GOOGLE_API_KEY = os.getenv("MAPS")

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"

CORS(app, resources={r"/api/*": {"origins": "*"}})


class Globals:
    inner_radius = 4
    outer_radius = 10


def move_lat_lon(
    lat: float, lon: float, km_north: float = 0.0, km_east: float = 0.0
) -> Tuple[float, float]:
    delta_lat = km_north / 111
    delta_lon = km_east / (111 * math.cos(math.radians(lat)))

    new_lat = lat + delta_lat
    new_lon = lon + delta_lon

    return new_lat, new_lon


@app.route("/api/location")
def location():
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))

    lat, lon = move_lat_lon(
        lat,
        lon,
        random.uniform(Globals.inner_radius, Globals.outer_radius),
        random.uniform(Globals.inner_radius, Globals.outer_radius),
    )

    params = [
        {
            "size": "600x400",
            "location": f"{lat},{lon}",
            "radius": 50000,
            "key": GOOGLE_API_KEY,
        }
    ]

    results = google_streetview.api.results(params)
    meta = results.metadata[0]

    if meta["status"] != "OK":
        return jsonify({"error": "No Street View panorama nearby"}), 404

    pano_lat = meta["location"]["lat"]
    pano_lon = meta["location"]["lng"]
    image_url = results.links[0]

    jpeg = requests.get(image_url, timeout=20).content
    img_b64 = base64.b64encode(jpeg).decode("utf-8")

    return jsonify({"image": img_b64, "lat": pano_lat, "lon": pano_lon})
