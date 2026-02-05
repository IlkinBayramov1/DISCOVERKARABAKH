import mongoose from 'mongoose';
import { hashPassword } from '../../../utils/hash.util.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin', 'tourist', 'resident', 'investor'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true, // Default true for normal users
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await hashPassword(this.password);
});

export const User = mongoose.model('User', userSchema);
