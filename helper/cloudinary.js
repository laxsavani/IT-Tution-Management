const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name:"djn7ivlo7",
    api_key:"278376822492173",
    api_secret:"n7gWH7n3c1PP5l3ZmZtCUWMWUsA"
});

module.exports = cloudinary;