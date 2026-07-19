import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/index.js';
import { driverService } from '../driver/driver.service.js';

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

        // Join personal notification room
        socket.join(`user_${socket.user.id}`);
        console.log(`📡 User ${socket.user.id} joined personal notification room`);

        if (socket.user.role === 'driver') {
            socket.join(`driver_${socket.user.id}`);
            console.log(`📡 Driver ${socket.user.id} joined personal receive channel`);
        }

        // Join a specific ride room to listen for updates or send them
        socket.on('joinRoom', (room) => {
            socket.join(room); // e.g., "ride_123" or "vendor_456"
            console.log(`User ${socket.user.id} joined room: ${room}`);
            socket.emit('joined', { room, message: `Joined room ${room}` });
        });

        // Driver sending location updates
        socket.on('updateLocation', async (data) => {
            // data: { lat, lng, rideId }
            if (socket.user.role !== 'driver' && socket.user.role !== 'admin') {
                return; 
            }

            // Update global redis index for this driver's location (Passive / Active)
            try {
                const driver = await driverService.updateStatus(socket.user.id, socket.user.id, 'Online', data.lat, data.lng);
                
                // Broadcast to Vendor boss if managed
                if (driver && driver.managedById) {
                    io.to(`vendor_${driver.managedById}`).emit('fleet_driver_location', {
                        driverId: socket.user.id,
                        firstName: driver.firstName,
                        lastName: driver.lastName,
                        location: { lat: data.lat, lng: data.lng },
                        status: driver.status,
                        timestamp: new Date()
                    });
                }
            } catch (err) {
                console.error("Failed to update driver spatial location", err.message);
            }

            if (data.rideId) {
                console.log(`📍 Location update from ${socket.user.id} for ride ${data.rideId}:`, data.lat, data.lng);

                // Broadcast to everyone in the ride room (Passenger + Driver themselves)
                io.to(`ride_${data.rideId}`).emit('driverLocation', {
                    driverId: socket.user.id,
                    location: { lat: data.lat, lng: data.lng },
                    timestamp: new Date()
                });
            }
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
