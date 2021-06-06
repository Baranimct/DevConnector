const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { ResultWithContext } = require('express-validator/src/chain');
const request = require('request');
const config = require('config');


//@route Get api/Profile/me 
//@desc get current users profile
//@access private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        res.json(profile);

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
//@route DELETE api/Profile/
//@desc  Delete profile user and posts
//@access private

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        return res.json({ msg: "User is deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/Profile/experience
//@desc  add/update user profile experience
//@access private

router.put('/experience', [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne(({ user: req.user.id }));
            if (!profile) {
                res.status(428).json("Please create a profile first");
            }
            else {
                profile.experience.unshift(newExp);
                await profile.save();

                res.json(profile);
            }


        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    });

//@route PUT api/Profile/experience/Exp_id:
//@desc  Delete user profile experience
//@access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne(({ user: req.user.id }));

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        console.log(removeIndex);
        if (removeIndex != -1)
            profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

//@route PUT api/Profile/education
//@desc  add/update user profile education
//@access private

router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne(({ user: req.user.id }));
            if (!profile) {
                res.status(428).json("Please create a profile first");
            }
            else {
                profile.education.unshift(newEdu);
                await profile.save();

                res.json(profile);
            }


        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    });

//@route PUT api/Profile/experience/Exp_id:
//@desc  Delete user profile experience
//@access private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne(({ user: req.user.id }));

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        console.log(removeIndex);
        if (removeIndex != -1)
            profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/Profile/GitHub/Githubusername:
//@desc  Github user repos 
//@access public

router.get('/github/:username', (req, res) => {
    try {
        const clientid = config.get('githubClientId');
        const secret = config.get('githubSecret');
        const uril = 'https://api.github.com/users/' + req.params.username;
        const options = {
            uri: uril,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }

        };

        console.log(options.uri);
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'No GitHub profile found' });
            }

            res.json(JSON.parse(body));
        }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})



module.exports = router;

