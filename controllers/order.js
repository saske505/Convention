var Order = require('../models/order');

// display list of all Orders
exports.order_list = function(req, res, next) {

  Order.find()
    .populate('user')
    .exec(function (err, list_orders) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('order_list', {title: 'Order List', order_list: list_orders});
    });
};

// display detail page for a specific Order
exports.order_detail = function(req, res, next) {
    Order.findById(req.params.id)
    .populate('user')
    .exec(function (err, order) {
      if (err) { return next(err); }
      if (order === null) { // No results.
          var err = new Error('Order not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('order_detail', { title: 'Order', order:  order});
    });
};

// display Order create form on GET
exports.order_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Order create GET');  
};

// handle Order create on POST
exports.order_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order create POST');
};

// display Order delete form on GET
exports.order_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Order delete GET');
};

// handle Order delete on POST
exports.order_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order delete POST');
};

// display Order update form GET
exports.order_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Order update GET');
};

// handle Order update on POST
exports.order_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Order update POST');
};