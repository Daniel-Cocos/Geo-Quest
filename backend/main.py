from backend import app

def main() -> None:
    app.run(debug=True, port=8000)

if __name__ == "__main__":
    main()
