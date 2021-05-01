const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// User Model
const User = require('../models/User');

router.get('/login', (request, response) => {
    response.render('login');
});

router.get('/register', (request, response) => {
    response.render('register');
});

// Register Handle
router.post('/register', (request, response) => {
    const { name, email, password, password2 } = request.body;
    let errors = [];

    // Check required fields 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        response.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already registered' })
                    response.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) throw error;

                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    request.flash('success_msg', 'You are now registered, and can login.');
                                    response.redirect('/users/login');
                                })
                                .catch(error => console.log((error)));
                        });
                    });
                }
            });
    }
});

// Login Handle

router.post('/login', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(request, response, next);
});

// Logout handle

router.get('/logout', (request, response) => {
    request.logout();
    request.flash('success_msg', 'You are logged out');
    response.redirect('/users/login');
}); 

module.exports = router;