const mongoose = require('mongoose');

const tranSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxLength: 20,
        trim: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'userr',
         required : true
    }
}, { timestamps: true })

const transaction = mongoose.model('transction', tranSchema);

module.exports = transaction;
