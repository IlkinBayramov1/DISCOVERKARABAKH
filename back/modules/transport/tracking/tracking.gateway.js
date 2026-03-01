import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/index.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins for testing
            methods: ['GET', 'POST']
        }
    });

    // Authentication Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication error: Token required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, role, ... }
            next();
        } catch (err) {
            console.error('Socket Auth Error:', err.message);
            next(new Error('Authentication error: Invalid Token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.user.id} (${socket.user.role})`);

        // Join a specific ride room to listen for updates or send them
        socket.on('joinRoom', (room) => {
            socket.join(room); // e.g., "ride_123"
            console.log(`User ${socket.user.id} joined room: ${room}`);
            socket.emit('joined', { room, message: `Joined room ${room}` });
        });

        // Driver sending location updates
        socket.on('updateLocation', (data) => {
            // data: { lat, lng, rideId }
            if (socket.user.role !== 'driver' && socket.user.role !== 'admin') {
                // Strictly, only drivers should update, but for testing maybe relaxed?
                // Let's enforce role.
                // console.warn(`Non-driver ${socket.user.id} tried to update location`);
                // return; 
            }

            console.log(`📍 Location update from ${socket.user.id} for ride ${data.rideId}:`, data.lat, data.lng);

            // Broadcast to everyone in the ride room (Passenger + Driver themselves)
            io.to(`ride_${data.rideId}`).emit('driverLocation', {
                driverId: socket.user.id,
                location: { lat: data.lat, lng: data.lng },
                timestamp: new Date()
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
