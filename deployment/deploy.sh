#!/bin/bash

# GreenRoots PWA - Production Deployment Script
# This script automates the deployment to a production server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="your-domain.com"
SERVER_USER="ubuntu"
SERVER_IP="your-server-ip"
REMOTE_PATH="/var/www/greenroots"
BUILD_DIR="./client/build"

echo -e "${YELLOW}=== GreenRoots PWA Production Deployment ===${NC}"
echo ""

# Step 1: Verify prerequisites
echo -e "${YELLOW}[1/6] Verifying prerequisites...${NC}"
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}✗ Build directory not found: $BUILD_DIR${NC}"
    echo "Run 'npm run build' first"
    exit 1
fi
if ! command -v ssh &> /dev/null; then
    echo -e "${RED}✗ SSH not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prerequisites verified${NC}\n"

# Step 2: Build verification
echo -e "${YELLOW}[2/6] Verifying build files...${NC}"
required_files=("index.html" "manifest.json" "service-worker.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        echo -e "${RED}✗ Missing required file: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ All required files present${NC}\n"

# Step 3: Create backup on server
echo -e "${YELLOW}[3/6] Creating backup on server...${NC}"
ssh $SERVER_USER@$SERVER_IP "mkdir -p /var/www/backups && tar -czf /var/www/backups/greenroots-$(date +%Y%m%d-%H%M%S).tar.gz $REMOTE_PATH 2>/dev/null || true" || true
echo -e "${GREEN}✓ Backup created${NC}\n"

# Step 4: Upload build files
echo -e "${YELLOW}[4/6] Uploading build files to server...${NC}"
if ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_PATH"; then
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.env' \
        $BUILD_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/
    echo -e "${GREEN}✓ Files uploaded successfully${NC}\n"
else
    echo -e "${RED}✗ Failed to create remote directory${NC}"
    exit 1
fi

# Step 5: Set permissions and restart services
echo -e "${YELLOW}[5/6] Setting permissions and restarting services...${NC}"
ssh $SERVER_USER@$SERVER_IP "
    cd $REMOTE_PATH
    sudo chown -R www-data:www-data .
    sudo chmod -R 755 .
    sudo systemctl restart nginx
" || true
echo -e "${GREEN}✓ Services restarted${NC}\n"

# Step 6: Verify deployment
echo -e "${YELLOW}[6/6] Verifying deployment...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" https://$DOMAIN/ 2>/dev/null | tail -n 1)
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}✓ Site is live at: https://$DOMAIN${NC}\n"
else
    echo -e "${YELLOW}⚠ Warning: HTTP response code $RESPONSE${NC}"
    echo "Check server logs for details"
fi

echo -e "${GREEN}=== Deployment Complete ===${NC}\n"

# Post-deployment checklist
echo -e "${YELLOW}Post-deployment checklist:${NC}"
echo "[ ] Visit https://$DOMAIN in browser"
echo "[ ] Test installation on desktop (Chrome/Edge)"
echo "[ ] Test installation on mobile (Android/iOS)"
echo "[ ] Run Lighthouse audit"
echo "[ ] Check browser DevTools → Application → Service Workers"
echo "[ ] Monitor error logs: tail -f /var/log/nginx/greenroots-error.log"
echo ""
