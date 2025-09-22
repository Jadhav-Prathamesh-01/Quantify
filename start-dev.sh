#!/bin/bash

# Start Quantify Rating Development Environment

echo "🚀 Starting Quantify Rating Development Environment..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is already in use"
        return 0
    else
        echo "❌ Port $1 is not in use"
        return 1
    fi
}

# Check if backend is running
if check_port 3001; then
    echo "✅ Backend is already running on port 3001"
else
    echo "🔄 Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
fi

# Wait a moment for backend to start
sleep 3

# Check if frontend is running
if check_port 5173; then
    echo "✅ Frontend is already running on port 5173"
else
    echo "🔄 Starting frontend server..."
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
fi

echo ""
echo "🎉 Development environment started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo "🏥 Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
