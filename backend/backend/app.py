import base64
import json
import math
import os
import random
from datetime import timedelta
from typing import Tuple

import google_streetview.api
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    exceptions,
    get_jwt_identity,
    verify_jwt_in_request,
)
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

GOOGLE_API_KEY = os.getenv("MAPS")
app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["JWT_SECRET_KEY"] = "ajkflajsdf93wjf328hfD734"
CORS(app, resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager(app)


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
        with open(DATA_PATH, "w", encoding="utf-8") as f:
            json.dump({}, f)
        return {}

    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    except json.JSONDecodeError:
        with open(DATA_PATH, "w", encoding="utf-8") as f:
            json.dump({}, f)

        return {}


def save_users(users):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(users, f)


@app.route("/api/check")
def check_login():
    try:
        verify_jwt_in_request()
        username = get_jwt_identity()
        return jsonify({"logged_in": True, "user": username})
    except exceptions.NoAuthorizationError:
        return jsonify({"logged_in": False}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username").strip()
    password = data.get("password")

    users = load_users()

    if username in users:
        return jsonify({"data": "Username already exists"}), 200

    users[username] = generate_password_hash(password)
    users["score"] = 0

    save_users(users)

    return jsonify({"data": "success"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username").strip()
    password = data.get("password")

    users = load_users()

    if username in users and check_password_hash(users[username], password):
        access_token = create_access_token(
            identity=username, expires_delta=timedelta(days=7)
        )

        return jsonify(access_token=access_token)

    return jsonify({"msg": "Invalid credentials"}), 401


@app.before_request
def check_jwt():
    public_paths = ["/api/login", "/api/register"]
    if any(request.path.startswith(p) for p in public_paths):
        return

    try:
        verify_jwt_in_request()
    except exceptions.NoAuthorizationError:
        return jsonify({"redirect": "/login"}), 401


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
