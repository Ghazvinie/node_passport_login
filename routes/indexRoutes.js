const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/off');

// Welcome
router.get('/', (request, response) => {
    response.render('welcome');
});

//Dashboard
router.get('/dashboard', ensureAuthenticated, (request, response) => {
    response.render('dashboard', {
        name : request.user.name
    });
});

module.exports = router;