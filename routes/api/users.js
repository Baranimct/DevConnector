const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");

//@route Post api/Users 
//@desc Register Users
//@access public

router.post('/',
    [
        check('Name', 'Name is required').not().isEmpty(),
        check('Email', 'Please include a valid Email').isEmail(),
        check('Password', 'Please enter the password more than 6 charadcters').isLength({ min: 6 })
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.send("User route");
    }
);

module.exports = router;