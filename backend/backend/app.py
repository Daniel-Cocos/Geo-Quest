from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"

CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/hello", methods=["POST", "GET"])
def hello():
    name = request.args.get("name")
    fmt_message = f"hello {name}"

    return jsonify({"data": fmt_message})
