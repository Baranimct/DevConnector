const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');


//@route Get api/Profile/me 
//@desc get current users profile
//@access private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            res.status(400).json({ msg: "There is no profile for this user" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});


//@route Post api/Profile 
//@desc get create/update users profile
//@access private

router.post('/', [auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            instagram,
            twitter,
            linkedin
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        console.log(profileFields.skills);


        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id },
                    { $set: profileFields },
                    { new: true },

                );
                return res.json(profile);
            }

            //create profile
            profile = new Profile(profileFields);

            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//@route Get api/Profile 
//@desc all users profile
//@access public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profiles = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profiles) {
            res.status(400).json({ mes: " profile not found" });
        }
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            res.status(400).json({ mes: " profile not FOund" });
        }
        res.status(500).send('Server Error');
    }
});


//@route Get api/Profile/user/:userId 
//@desc  get  profile by user id
//@access publicS

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});
module.exports = router;