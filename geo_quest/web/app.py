from flask import Flask, redirect, render_template, request, session, url_for
from werkzeug.wrappers import Response

app = Flask(__name__)
app.secret_key = "anna bannana"


@app.route("/")
def main():
    return redirect(url_for("index"))


@app.route("/filters.html", methods=["GET", "POST"])
def settings():
    if request.method == "POST":
        session["slider1"] = {
            "left": request.form.get("slider1_left"),
            "right": request.form.get("slider1_right"),
        }
        session["slider2"] = {
            "left": request.form.get("slider2_left"),
            "right": request.form.get("slider2_right"),
        }
        return redirect(url_for("index"))

    slider1 = session.get("slider1", {"left": "2", "right": "8"})
    slider2 = session.get("slider2", {"left": "2", "right": "10"})
    return render_template("filters.html", slider1=slider1, slider2=slider2)


@app.route("/index.html")
def index():
    slider1 = session.get("slider1", {"left": None, "right": None})
    slider2 = session.get("slider2", {"left": None, "right": None})

    return render_template(
        "index.html",
        slider1_left=slider1["left"],
        slider1_right=slider1["right"],
        slider2_left=slider2["left"],
        slider2_right=slider2["right"],
    )


@app.route("/rules.html")
def rules():
    return render_template("rules.html")


if __name__ == "__main__":
    app.run(debug=True)
