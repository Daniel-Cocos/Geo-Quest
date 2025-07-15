import base64
import os

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


@app.route("/api/location")
def location():
    lat = 40
    lon = 19.5

    if lat is None or lon is None:
        return jsonify({"error": "Missing lat/lon"}), 400

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

