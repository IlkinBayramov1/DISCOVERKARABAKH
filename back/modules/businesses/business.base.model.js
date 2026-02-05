import mongoose from 'mongoose';
import slugify from 'slugify';

const businessSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters'],
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number can not be more than 20 characters'],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        images: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        discriminatorKey: 'businessType',
    }
);

businessSchema.pre('save', async function () {
    this.slug = slugify(this.name, { lower: true });
});

export const Business = mongoose.model('Business', businessSchema);
