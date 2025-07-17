import base64
import json
import math
import os
import random
from typing import Tuple

import google_streetview.api
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

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
    return lat + delta_lat, lon + delta_lon


DATA_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
DATA_PATH = os.path.join(DATA_DIR, "users.json")


def load_users():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_PATH):
        with open(DATA_PATH, "w") as f:
            json.dump({}, f)
        return {}
    try:
        with open(DATA_PATH, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        with open(DATA_PATH, "w") as f:
            json.dump({}, f)
        return {}


def save_users(users):
    with open(DATA_PATH, "w") as f:
        json.dump(users, f)


@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Internal server error", "detail": str(e)}), 500


@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json(force=True)
        username = data.get("username", "").strip()
        password = data.get("password", "")
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400
        if len(password) < 12 or password.lower() == password or password.isalnum():
            return (
                jsonify(
                    {
                        "error": "Password must be at least 12 characters, include a capital letter and a symbol"
                    }
                ),
                400,
            )
        users = load_users()
        if username in users:
            return jsonify({"error": "Username already exists"}), 400
        users[username] = generate_password_hash(password)
        save_users(users)
        return jsonify({"message": "Registration successful"}), 200
    except Exception as ex:
        app.logger.exception("Error in /api/register")
        return jsonify({"error": "Internal server error", "detail": str(ex)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        username = data.get("username", "").strip()
        password = data.get("password", "")
        users = load_users()
        if username not in users or not check_password_hash(
            users.get(username, ""), password
        ):
            return jsonify({"error": "Invalid username or password"}), 400
        return jsonify({"message": "Login successful"}), 200
    except Exception as ex:
        app.logger.exception("Error in /api/login")
        return jsonify({"error": "Internal server error", "detail": str(ex)}), 500

@app.route("/api/ping")
def ping():
    return jsonify({"message": "It work"}), 200

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
    return jsonify({"image":+@app.route("/api/ping")



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
