#!/bin/bash

# Script to push this project to GitHub
# Run this after Xcode Command Line Tools installation is complete

cd "$(dirname "$0")"

# Initialize git repository (if not already initialized)
if [ ! -d .git ]; then
    git init
fi

# Add remote repository (if not already added)
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/bhunter10/photography.git
else
    git remote set-url origin https://github.com/bhunter10/photography.git
fi

# Add all files
git add .

# Commit changes
git commit -m "Initial commit" || git commit -m "Update project"

# Check if main branch exists, create it if needed
git branch -M main

# Push to GitHub (will prompt for credentials if needed)
git push -u origin main

echo "Done! Project pushed to GitHub."

