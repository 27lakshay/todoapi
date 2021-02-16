const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { registerValidation } = require("../validation");

//registering a new user
router.post("/user", async (req, res) => {
    //validate data before submission
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("email already exists");

    //hash passwords before submission
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    //create a new user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        res.send({ userId: newUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
