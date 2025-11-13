#!/bin/bash

# Dynamic IP Configuration Test Script
echo "🌐 Testing Dynamic IP Configuration..."

# Get current IP addresses
echo "📡 Network Configuration:"
echo "Local IP: $(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -1 | awk '{print $2}')"
echo "Hostname: $(hostname)"

# Check if the dev server is running on expected ports
echo ""
echo "🔍 Port Check:"
echo "Frontend (5173): $(lsof -ti:5173 && echo '✅ Running' || echo '❌ Not Running')"
echo "Backend (8081): $(lsof -ti:8081 && echo '✅ Running' || echo '❌ Not Running')"

# Test API connectivity with different IPs
echo ""
echo "🔗 API Connectivity Test:"

IPS=("localhost" "127.0.0.1" "192.168.2.143")

for ip in "${IPS[@]}"; do
    echo "Testing $ip:8081..."
    if curl -s --connect-timeout 3 "http://$ip:8081/api/public/banners" > /dev/null; then
        echo "  ✅ $ip:8081 - API reachable"
    else
        echo "  ❌ $ip:8081 - API not reachable"
    fi
done

echo ""
echo "📝 Current .env configuration:"
echo "VITE_API_BASE_URL=$(grep VITE_API_BASE_URL .env | cut -d'=' -f2)"
echo "VITE_IMAGE_BASE_URL=$(grep VITE_IMAGE_BASE_URL .env | cut -d'=' -f2)"

echo ""
echo "🚀 To test dynamic configuration:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:5173"
echo "3. Open: http://192.168.2.143:5173"
echo "4. Check console logs for dynamic URL detection"

echo ""
echo "✅ Test script completed!"