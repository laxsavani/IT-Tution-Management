const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
mongoose.connect("mongodb+srv://laxsavani:laxsavani@cluster0.ykxfhke.mongodb.net/Morsy")
    .then(()=>{
        console.log("connection is successfull");
    })
    .catch((err)=>{
        console.log(`Databse not connected ${err}`);
    });