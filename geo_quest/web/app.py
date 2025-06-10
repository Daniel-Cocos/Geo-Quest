from flask import Flask, redirect, render_template
from werkzeug.wrappers import Response

app = Flask(__name__)


@app.route("/")
def main() -> Response:
    return redirect("http://localhost:5000/index.html")


@app.route("/filters.html")
def settings() -> str:
    return render_template("filters.html")


@app.route("/index.html")
def index() -> str:
    return render_template("index.html")


@app.route("/rules.html")
def rules() -> str:
    return render_template("rules.html")


if __name__ == "__main__":
    app.run(debug=True)
