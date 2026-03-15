#!/bin/bash
# Start backend and frontend for local development.
# Requires: astro-api sibling folder with npm install done.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$(cd "$ROOT/.." && pwd)/astro-api"

echo "Starting Jyotish Guru Backend (port 3000)..."
cd "$API_DIR" && node server.js &
API_PID=$!

echo "Starting Jyotish Guru Frontend..."
cd "$ROOT" && npx expo start --web

kill $API_PID 2>/dev/null || true
