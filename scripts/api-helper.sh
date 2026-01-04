#!/bin/bash

# Payload API Helper Script
# Makes it easy to interact with Payload CMS via REST API

BASE_URL="http://localhost:3000/api"
TOKEN_FILE=".api-token"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to save token
save_token() {
    echo "$1" > "$TOKEN_FILE"
    echo -e "${GREEN}✓ Token saved${NC}"
}

# Function to load token
load_token() {
    if [ -f "$TOKEN_FILE" ]; then
        cat "$TOKEN_FILE"
    else
        echo ""
    fi
}

# Function to login
login() {
    echo -e "${BLUE}Payload CMS Login${NC}"
    read -p "Email: " email
    read -sp "Password: " password
    echo ""
    
    response=$(curl -s -X POST "$BASE_URL/users/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        save_token "$token"
        echo -e "${GREEN}✓ Login successful${NC}"
    else
        echo -e "${RED}✗ Login failed${NC}"
        echo "$response"
    fi
}

# Function to create first user
create_first_user() {
    echo -e "${BLUE}Create First User${NC}"
    read -p "Email: " email
    read -sp "Password: " password
    echo ""
    read -p "Name: " name
    
    response=$(curl -s -X POST "$BASE_URL/users/first-register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\",\"name\":\"$name\"}")
    
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# Function to list collections
list_collections() {
    TOKEN=$(load_token)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Please login first${NC}"
        return
    fi
    
    curl -s -X GET "$BASE_URL/collections" \
        -H "Authorization: JWT $TOKEN" | jq '.'
}

# Function to create collection
create_collection() {
    TOKEN=$(load_token)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Please login first${NC}"
        return
    fi
    
    echo -e "${BLUE}Create Collection${NC}"
    read -p "Title: " title
    read -p "Description: " description
    read -p "Order (number): " order
    
    curl -s -X POST "$BASE_URL/collections" \
        -H "Content-Type: application/json" \
        -H "Authorization: JWT $TOKEN" \
        -d "{\"title\":\"$title\",\"description\":\"$description\",\"order\":$order}" | jq '.'
}

# Function to upload photo
upload_photo() {
    TOKEN=$(load_token)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Please login first${NC}"
        return
    fi
    
    echo -e "${BLUE}Upload Photo${NC}"
    read -p "Photo file path: " filepath
    read -p "Alt text: " alt
    read -p "Caption (optional): " caption
    
    if [ ! -f "$filepath" ]; then
        echo -e "${RED}File not found: $filepath${NC}"
        return
    fi
    
    curl -s -X POST "$BASE_URL/photos" \
        -H "Authorization: JWT $TOKEN" \
        -F "file=@$filepath" \
        -F "alt=$alt" \
        -F "caption=$caption" | jq '.'
}

# Function to list galleries
list_galleries() {
    TOKEN=$(load_token)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Please login first${NC}"
        return
    fi
    
    curl -s -X GET "$BASE_URL/galleries" \
        -H "Authorization: JWT $TOKEN" | jq '.'
}

# Function to create gallery
create_gallery() {
    TOKEN=$(load_token)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}Please login first${NC}"
        return
    fi
    
    echo -e "${BLUE}Create Gallery${NC}"
    read -p "Title: " title
    read -p "Collection ID: " collection_id
    read -p "Date (YYYY-MM-DD): " date
    read -p "Description: " description
    read -p "Published (true/false): " published
    
    curl -s -X POST "$BASE_URL/galleries" \
        -H "Content-Type: application/json" \
        -H "Authorization: JWT $TOKEN" \
        -d "{\"title\":\"$title\",\"collection\":\"$collection_id\",\"date\":\"$date\",\"description\":\"$description\",\"published\":$published,\"photos\":[]}" | jq '.'
}

# Main menu
show_menu() {
    echo ""
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}  Payload CMS API Helper${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo "1. Create first user"
    echo "2. Login"
    echo "3. List collections"
    echo "4. Create collection"
    echo "5. Upload photo"
    echo "6. List galleries"
    echo "7. Create gallery"
    echo "8. Exit"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Choose an option: " choice
    
    case $choice in
        1) create_first_user ;;
        2) login ;;
        3) list_collections ;;
        4) create_collection ;;
        5) upload_photo ;;
        6) list_galleries ;;
        7) create_gallery ;;
        8) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
done

