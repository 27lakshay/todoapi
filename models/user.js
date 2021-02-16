const mongoose = require("mongoose");

const Users = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            max: 255,
            min: 3,
        },
        email: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            min: 3,
        },
        todos: [
            {
                todo: String,
            },
        ],
    },
    { timestamps: true }
);
module.exports = mongoose.model("users", Users);
