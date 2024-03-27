const express = require("express");
const User = require("../models/User");
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require('mongoose');

const jsonParser = bodyParser.json();

const ObjectId = require('mongodb').ObjectId;

router.post("/", jsonParser, async (req, res) => {
    const { id: userId } = req.body;
    console.log(userId);
    try {
        const userById = await User.findById(userId);
        if (userById) {
            res.status(200).send({ 
                username: userById.username, 
                email: userById.email, // Corrected to retrieve user's email
                message: "login success" 
            });
        } else {
            res.status(404).send({ 
                errorField: "not_found", 
                message: "User not found" 
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
