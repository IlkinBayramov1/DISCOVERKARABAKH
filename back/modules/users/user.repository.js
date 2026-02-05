import { User } from './models/user.base.model.js';

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
