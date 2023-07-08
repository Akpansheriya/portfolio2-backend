const mongoose = require("mongoose");
const validator = require("validator");


const ApplySchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxlength: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxlength: 30
    },
    phone: {
        type: Number,
        trim: true,
        required: true,
        min: 10,
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"

    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new message("invalid email id")
            }
        }

    },

    profile: {

        type: String,

        required: true,
        trim: true

    },
    applyFor: {

        type: String,

        required: true,
        trim: true

    },
    experienceYear: {

        type: String,

        required: true,
        trim: true

    },
    experienceMonth: {

        type: String,

        required: true,
        trim: true

    },
    education: {
        type: String,
        required: true,
        trim: true
    },
    resume: {
        type: String
    },
    detail: {
        type: String,
        trim: true,
        required: true,
        minLenght: 3,
        maxlength: 150
    },

    date: {
        type: Date,
        default: Date.now


    }

});

module.exports = UserModel = mongoose.model("Apply", ApplySchema);