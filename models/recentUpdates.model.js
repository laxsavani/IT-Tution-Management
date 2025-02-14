var mongoose = require('mongoose');

var recents_updateSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    image_post: {
        type: Array,
    }
});


module.exports =  mongoose.model('recents_updates', recents_updateSchema);