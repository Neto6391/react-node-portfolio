const express  = require('express');
const router = express.Router();
const moongose = require('mongoose');
const passport = require('passport');

//Load Post Model
const Post = require('../../models/Post');

//Load Profile Model
const Profile = require('../../models/Profile');

//Load Validation Post
const validatePostInput = require('./../../validation/post');

/** @route       GET api/posts/test
 *  @desc        Test posts route
 *  @access      Public
 */
router.get('/test', (req, res) => res.json({msg: "Posts Works"})
);

/** @route       GET api/posts
 *  @desc        Get posts
 *  @access      Public
 */
router.get('/', (req, res) => {
    const errors = {};
    
    Post.find()
        .sort({ date: -1 })
        .then(posts => {
            if(!posts) {
                errors.nofoundposts = "no posts Found!";
                res.status(404).json(errors);
            }
            res.json(posts);
        })
        .catch(err => res.status(404).json({ nofoundposts: "no posts Found!" }));
});

/** @route       GET api/posts
 *  @desc        Get posts by ID
 *  @access      Public
 */
router.get('/:id', (req, res) => {
    const errors = {};
    
    Post.findById(req.params.id)
        .then(posts => {
            if(!posts) {
                errors.nofoundposts = "There are no posts with a ID";
                return res.status(404).json(errors);
            }
            res.json(posts);
        })
        .catch(err => res.status(404).json({ nofoundposts: "There are no posts with a ID" }));
});

/** @route       POST api/posts
 *  @desc        Test posts route
 *  @access      Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = validatePostInput(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

});


/** @route       DELETE api/posts/:id
 *  @desc        Delete posts By ID
 *  @access      Private
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //Check for post owner
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({ noauthorized: 'User not authorized' });
                    }

                    //Delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch((err) => res.status(404). json({ postnotfound: 'No post found' }));
        })
});

/** @route       POST api/posts/like/:id
 *  @desc        Like Post
 *  @access      Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alredyliked: 'User alredy liked this post' });
                    }

                    //Add user id to likes array
                    post.likes.unshift({ user: req.user.id });

                    post.save().then(post => res.json(post));
                });
        });
});


/** @route       POST api/posts/unlike/:id
 *  @desc        Unlike Post
 *  @access      Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: 'You have not yet liked this post' });
                    }

                    //Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    post.save().then(post => res.json(post));

                    //Splice out of array
                    post.likes.splice(removeIndex, 1);

                    //Save
                    post.save().then(post => res.json(post));
                })
                .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
        });
});

/** @route       POST api/posts/comment/:id
 *  @desc        Add comment to post
 *  @access      Private
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };

            //Add to comments array
            post.comments.unshift(newComment);

            //Save
            post.save().then(post => res.json(post));

        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

/** @route       DELETE api/posts/comment/:id
 *  @desc        Remove a comment of post
 *  @access      Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            //Check to see if comment exists
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return status(404).json({ commentnotexists: 'Comment does not exist' });
            }
        
            //Filter comment to be deleted
            const updatedComments = post.comments.filter((comment) => !(comment.user.toString() === req.user.id && comment._id.toString() === req.params.comment_id));
            
            if(updatedComments.length === post.comments.length) {
                return res.status(401).json({ notauthorized: 'If you\'re seeing this that means either of three things \n 1. You used postman or some other tool to send this request to delete someone else\'s comment \n 2. You changed the JavaScript on the front-end to send this request \n 3. You made your own script to make the requst.'});
            }
            console.log(updatedComments);
            post.comments = updatedComments;
            post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;