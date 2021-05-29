const express = require('express');
const router = express.Router();

//@route Get api/Auth 
//@desc Test route
//@access public

router.get('/', (req, res) => res.send("Authentication route"));

module.exports = router;