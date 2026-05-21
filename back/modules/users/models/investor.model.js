import mongoose from 'mongoose';
import { User } from './user.base.model.js';

const investorSchema = new mongoose.Schema({
  companyName: String,
  investmentFocus: [String], // e.g. 'Hotels', 'Infrastructure'
  budgetRange: {
    min: Number,
    max: Number,
  },
  verifiedInvestor: {
    type: Boolean,
    default: false,
  }
});

export const Investor = User.discriminator('investor', investorSchema);
