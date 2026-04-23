# Makefile for Django + Svelte project
# Provides shortcuts for common development tasks

.PHONY: help install backend-install frontend-install dev build up down logs test shell migrate makemigrations createsuperuser clean prism prism-stop logs-prism

# Default target
help:
	@echo "Available targets:"
	@echo "  install          - Install all dependencies (backend + frontend)"
	@echo "  backend-install  - Install backend dependencies (PDM)"
	@echo "  frontend-install - Install frontend dependencies (npm)"
	@echo ""
	@echo "  dev              - Start development servers (both backend and frontend locally)"
	@echo "  backend-dev      - Start backend development server (local)"
	@echo "  frontend-dev     - Start frontend development server (local)"
	@echo ""
	@echo "  up               - Start all services via Docker Compose"
	@echo "  down             - Stop all Docker services"
	@echo "  build            - Build all Docker images"
	@echo "  logs             - View Docker logs (backend by default)"
	@echo "  logs-frontend    - View frontend Docker logs"
	@echo "  logs-prism       - View Prism mock API logs"
	@echo "  restart          - Restart all Docker services"
	@echo "  prism            - Start Prism mock API server only"
	@echo ""
	@echo "  migrate          - Apply Django migrations (local)"
	@echo "  makemigrations   - Create Django migrations (local)"
	@echo "  createsuperuser  - Create Django superuser (local)"
	@echo "  shell            - Open Django shell (local)"
	@echo "  test             - Run Django tests (local)"
	@echo ""
	@echo "  clean            - Clean up build artifacts and cache"

# Installation targets
install: backend-install frontend-install

backend-install:
	@echo "Installing backend dependencies..."
	cd backend && pdm install

frontend-install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Development servers (local)
dev:
	@echo "Starting development servers..."
	@echo "Note: Run 'make backend-dev' and 'make frontend-dev' in separate terminals"
	@echo "Or use 'make up' to run via Docker"

backend-dev:
	cd backend && pdm run dev

frontend-dev:
	cd frontend && npm run dev

# Docker targets
up:
	@echo "Starting all services via Docker Compose..."
	docker-compose up -d

up-build:
	@echo "Building and starting all services..."
	docker-compose up --build -d

down:
	@echo "Stopping all Docker services..."
	docker-compose down

build:
	@echo "Building Docker images..."
	docker-compose build

restart:
	@echo "Restarting all Docker services..."
	docker-compose restart

logs:
	@echo "Showing backend logs..."
	docker-compose logs -f backend

logs-frontend:
	@echo "Showing frontend logs..."
	docker-compose logs -f frontend

logs-all:
	@echo "Showing all logs..."
	docker-compose logs -f

logs-prism:
	@echo "Showing Prism mock API logs..."
	docker-compose logs -f prism

# Prism mock server
prism:
	@echo "Starting Prism mock API server..."
	@echo "Mock API will be available at http://localhost:4010"
	docker-compose up -d prism

prism-stop:
	@echo "Stopping Prism mock API server..."
	docker-compose stop prism

# Django management commands (local)
migrate:
	cd backend && pdm run migrate

makemigrations:
	cd backend && pdm run makemigrations

createsuperuser:
	cd backend && pdm run createsuperuser

shell:
	cd backend && pdm run shell

test:
	cd backend && pdm run test

# Utility targets
clean:
	@echo "Cleaning up..."
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -type f -name "*.pyc" -delete 2>/dev/null || true
	cd frontend && rm -rf dist node_modules/.cache 2>/dev/null || true
	docker-compose down -v 2>/dev/null || true
	@echo "Cleanup complete"

status:
	@echo "Docker containers status:"
	docker-compose ps
