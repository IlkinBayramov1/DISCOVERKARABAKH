import { userRepository } from './user.repository.js';

class UserService {
    async getProfile(userId) {
        return userRepository.findById(userId);
    }

    async updateProfile(userId, data) {
        // Business logic if needed (e.g. restrict certain updates)
        return userRepository.update(userId, data);
    }
}

export const userService = new UserService(); 
