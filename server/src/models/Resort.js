import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1 guest'],
  },
  amenities: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true,
  },
  pricePerNight: {
    type: Number,
    default: null,
  },
});

const resortSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resort name is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Resort location is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
      default: 4.5,
    },
    openingHours: {
      type: String,
      required: [true, 'Opening hours are required'],
      default: 'Open 24 Hours',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: '',
      trim: true,
    },
    rooms: {
      type: [roomSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Resort = mongoose.model('Resort', resortSchema);
