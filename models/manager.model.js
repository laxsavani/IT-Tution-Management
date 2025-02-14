const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    managername: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

module.exports = mongoose.model('manager', managerSchema);