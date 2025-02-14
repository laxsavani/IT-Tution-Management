const mongoose = require('mongoose');

const pay_feesSchema = mongoose.Schema({
    amount: {
        type: String
    },
    pay_type: {
        type: String
    },
    student_id: {
        type: String
    },
    date: {
        type: String,
        required: true
    }
});

var pay_fees = mongoose.model('pay_fees', pay_feesSchema);
module.exports = pay_fees;