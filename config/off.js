const { request } = require("express")

module.exports = {
    ensureAuthenticated: function (request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        request.flash('error_msg', 'Please login to view this resource');
        response.redirect('/users/login');
    }
};