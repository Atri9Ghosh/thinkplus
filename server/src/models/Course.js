import mongoose from 'mongoose';

const curriculumItemSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true
  },
  topics: [{
    type: String
  }]
}, { _id: false });

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  module: {
    type: String,
    default: ''
  }
}, { _id: false });

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'video', 'link'],
    default: 'pdf'
  },
  url: {
    type: String,
    required: true
  }
}, { _id: false });

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['IPMAT', 'CAT', 'CLAT'],
    required: true
  },
  duration: {
    type: String,
    default: '6 months'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  curriculum: [curriculumItemSchema],
  instructor: instructorSchema,
  videos: [videoSchema],
  materials: [materialSchema],
  enrolledCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ examType: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledCount: -1 });

export default mongoose.model('Course', courseSchema);




