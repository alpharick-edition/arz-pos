#!/bin/bash
echo "========================================"
echo "  ARZ POS - Starting..."
echo "========================================"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for first time... please wait."
    echo "This only happens once!"
    echo ""
    npm install
    echo ""
fi

echo "Opening ARZ POS in your browser..."
echo "Press CTRL+C to stop the server."
echo ""
npm run start
