const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

//Register

router.post('/register', async (req, res) => {


    try {
        //generate new password with encryption
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,

        });
        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Login 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        bcrypt.hash(user.password, 10, async function (err, hash) {
            if (err) { throw (err); }

            var validPassword = await bcrypt.compare(req.body.password, hash);
            !validPassword && res.status(400).json("Wrong Password");

            if (validPassword) {
                res.status(200).json(user);
            }
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;