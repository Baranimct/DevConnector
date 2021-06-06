const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route Post api/Post 
//@desc cretae post 
//@access private

router.post('/', [auth,
    check('text', 'text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');

    }
});


//@route Post api/Post 
//@desc get all post 
//@access private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route Post api/Posts/:id
//@desc get users post 
//@access private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        //   if(post.user.toString!=req.user.id){
        //    return res.status(401).message("user not authorized");
        //   }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send('Server Error');
    }
});

//@route delete api/Posts/:id
//@desc Delete a   post 
//@access private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "user not authorized" });
        }

        await post.remove();

        res.json({ msg: "Post removed" });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send('Server Error');
    }
});

//@route PUT api/Posts/like:id
//@desc Like a   post 
//@access private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //if post is already kliked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ mes: " Post already Liked" });
        }
        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/Posts/unlike:id
//@desc Unlike a   post 
//@access private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //if post is already kliked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ mes: " Post has not been Liked" });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        if (removeIndex != -1)
            post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.esrror(error.message);
        res.status(500).send('Server Error');
    }
});

//@route Comment api/Post /commment/id
//@desc add comment 
//@access private

router.post('/comment/:id', [auth,
    check('text', 'text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');

    }
});

//@route Comment api/Post /commment/:id/:commentid
//@desc del comment 
//@access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //pull comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'comment doesnt exist' });
        }

        if (post.user.toString() !== req.user.id && comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "user not authorized" });
        }

        const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id);

        if (removeIndex != -1)
            post.comments.splice(removeIndex, 1);

        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;