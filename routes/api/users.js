const express  = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Import User of Model
const User = require('../../models/User');

/** @route      GET api/users/test
 * @desc        Test users route
 * @access      Public
 */
router.get('/test', (req, res) => res.json({msg: "Users Works"})
);

/** @route      POST api/users/register
 * @desc        Register user
 * @access      Public
 */
router.post('/register', (req, res) => {
    
    const { errors, isValid } =  validateRegisterInput(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({ email: req.body.email  })
        .then(user => {
            if(user){
                errors.email = 'Email já existente!'
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', 
                    r: 'pg', //Rating
                    d: 'mm' //Default
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});


/** @route      POST api/users/login
 * @desc        Login User / Returning JWT Token
 * @access      Public
 */
router.post('/login', (req, res) => {
    const { errors, isValid } =  validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;
    
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //Find User by Email
    User.findOne({email})
        .then(user => {
            //Check for user
            if(!user) {
                errors.email = 'Incorrect user/password combination';
                errors.password = 'Incorrect user/password combination';
                return res.status(404).json(errors);
            }

            //Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //User Matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar };
                        //Sign Web Token
                        jwt.sign(payload, key.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    } else {
                        errors.email = 'Incorrect user/password combination';
                        errors.password = 'Incorrect user/password combination';
                        res.status(400).json(errors);
                    }
                });
        });
});


/** @route      POST api/users/current
 * @desc        Return current user
 * @access      Private
 */
 router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
 });

module.exports = router;