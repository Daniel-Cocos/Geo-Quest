.PHONY: run-backend run-frontend run

run-backend:
	cd backend && poetry run python main.py

run-frontend:
	cd client && npm run dev

run:
	make -j2 run-backend run-frontend

