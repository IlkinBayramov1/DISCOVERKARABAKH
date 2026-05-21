import mongoose from 'mongoose';
import { User } from './user.base.model.js';

const residentSchema = new mongoose.Schema({
  permitNumber: {
    type: String,
    required: true,
    unique: true,
  },
  localAddress: {
    type: String,
    required: true,
  },
  familyMembers: [
    {
      name: String,
      relation: String,
    }
  ]
});

export const Resident = User.discriminator('resident', residentSchema);
