const express = require('express');
const router = express.Router();

//@route Get api/Users 
//@desc Test route
//@access public

router.get('/', (req, res) => res.send("Users route"));

module.exports = router;