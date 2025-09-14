const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userID: {
        type: String
    },

    email: {
        type: email
    },

    password: {
        type: String
    },

    fullname: {
        type: String
    },

    role: {
        type: Enumerator["admin", "chef", manager]
    },

    phone: {
        type: String
    },

    createdAt: {
        type: Date
    },

    updatedAt: {
        type: Date
    }
})