const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: String,
    featuredImage: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    tags: [String],
    category: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    readingTime: Number,
    views: {
        type: Number,
        default: 0
    },
    publishedAt: Date
}, {
    timestamps: true
});

// Create blog slug from the title
BlogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);
