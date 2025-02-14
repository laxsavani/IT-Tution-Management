const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
    name: {
        type: String,
    },
    date: {
        type: String,
    },
    field: {
        type: String,
    },
    phone: {
        type: String,
    },
    resoan: {
        type: String,
    },
    time: {
        type: String,
    },
    start_date: {
        type: String,
    },
    end_date: {
        type: String,
    },
    status: {
        type: Boolean
    },
    color: {
        type: String,
        enum: ['#fa4e576e', '#add483']
    },
    lastClicked: {
        type: Date,
        default: null
    },
    enquiry_number: {
        type: Number,
        default: 0,
    }
});

module.exports =  mongoose.model('enquiry', enquirySchema);