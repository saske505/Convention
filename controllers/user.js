var async = require('async');

// require models
var User = require('../models/user');
var Order = require('../models/order');

// require functions from express-validator
const {body, validtionResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.index = function(req, res) {   
    
    async.parallel({
        user_count: function(callback) {
            User.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        order_count: function(callback) {
            Order.count({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Convention', error: err, data: results});
    });
};

// display list of all Users
exports.user_list = function(req, res, next) {

  User.find({}, 'firstName lastName')
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('user_list', {title: 'User List', user_list: list_users});
    });
};

// display detail page for a specific User
exports.user_detail = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
              .exec(callback);
        },
        order: function(callback) {
          Order.find({ 'user': req.params.id })
          .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user === null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: 'User', user:  results.user, orders: results.order } );
    });
};

// display User create form on GET
exports.user_create_get = function(req, res, next) { 
    res.render('user_form', {title: 'Create User'});
};

// handle User create on POST
exports.user_create_post =  [
    // Validate that the firstName & lastName field is not empty.
    body('firstName', 'First Name required').isLength({ min: 1 }).trim(),
    body('lastName', 'Last Name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the firstName & lastName field.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a user object with escaped and trimmed data.
        var user = new User(
            { 
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        );

        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            res.render('user_form', { title: 'Create User', user: user, errors: errors.array()});
        return;
        }
        else {
            user.save(function (err) {
                if (err) { 
                    return next(err); 
                }
                
                // User saved. Redirect to user detail page
                res.redirect(user.url);
            });
        }
    }
];

// display User delete form on GET
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// handle User delete on POST
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// display user update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// handle user update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};