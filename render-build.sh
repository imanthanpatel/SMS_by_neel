#!/usr/bin/env bash

set -o errexit

echo "=================================="
echo "Installing Python dependencies..."
echo "=================================="

pip install -r backend/requirements.txt

echo "=================================="
echo "Installing React dependencies..."
echo "=================================="

cd frontend

npm ci

echo "=================================="
echo "Building React frontend..."
echo "=================================="

npm run build

echo "=================================="
echo "React build completed."
echo "=================================="
