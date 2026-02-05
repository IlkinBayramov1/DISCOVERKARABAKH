import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['hotel', 'tour'],
        message: 'Category must be either: hotel, tour',
      },
      required: [true, 'Please specify vendor category (hotel/tour)'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    contactPhone: String,
    address: String,
  },
  { timestamps: true }
);

export const Vendor = mongoose.model('Vendor', vendorSchema);
