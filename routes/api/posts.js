const express = require('express');
const router = express.Router();

//@route Get api/Post 
//@desc Test route
//@access public

router.get('/', (req, res) => res.send("Post route"));

module.exports = router;