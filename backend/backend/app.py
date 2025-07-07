from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "anna_bannana_secret")
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

DEFAULT_SLIDER1 = {"left": 2, "right": 8}
DEFAULT_SLIDER2 = {"left": 2, "right": 10}
DEFAULT_UNIT = "miles"

@app.route("/api/filters", methods=["GET", "POST"])
def filters_api():
    if request.method == "POST":
        data = request.get_json() or {}
        session['slider1'] = {
            'left': int(data.get('slider1_left', DEFAULT_SLIDER1['left'])),
            'right': int(data.get('slider1_right', DEFAULT_SLIDER1['right']))
        }
        session['slider2'] = {
            'left': int(data.get('slider2_left', DEFAULT_SLIDER2['left'])),
            'right': int(data.get('slider2_right', DEFAULT_SLIDER2['right']))
        }
        session['unit'] = data.get('unit', DEFAULT_UNIT)
        resp = jsonify({
            'slider1': session['slider1'],
            'slider2': session['slider2'],
            'unit': session['unit']
        })
        resp.headers.add('Access-Control-Allow-Credentials', 'true')
        return resp

    resp = jsonify({
        'slider1': session.get('slider1', DEFAULT_SLIDER1),
        'slider2': session.get('slider2', DEFAULT_SLIDER2),
        'unit': session.get('unit', DEFAULT_UNIT)
    })
    resp.headers.add('Access-Control-Allow-Credentials', 'true')
    return resp

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
