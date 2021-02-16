const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Users = require("../models/user");
const { loginValidation } = require("../validation");

router.get("/", auth, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.currentUser }).select("-password");
        const { email, role } = user;
        res.json({
            email,
            status: "authenticated",
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//login user
router.post("/user", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // //validating the data before user submission
    // const { error } = loginValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //checking if the email exists
    try {
        const user = await Users.findOne({ email: email });
        const validPass = await bcrypt.compare(password, user.password);
        console.log(user, validPass);
        if (user) {
            if (!validPass) return res.status(400).send("Incorrect password");
        } else return res.status(400).send("Email does not exist");
        //check password is correct or not

        //create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "12h",
        });
        res.json({
            token,
            status: "authenticated",
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
