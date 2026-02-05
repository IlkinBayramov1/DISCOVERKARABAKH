import mongoose from 'mongoose';
import { User } from './user.base.model.js';

const touristSchema = new mongoose.Schema({
  nationality: {
    type: String,
    required: true,
  },
  passportNumber: String,
  interests: [String],
});

export const Tourist = User.discriminator('tourist', touristSchema);
