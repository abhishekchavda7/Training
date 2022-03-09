const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');   

//Get all orders from the list
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3333/order' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

//Create an order
exports.orders_create_order =(req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(500).json({
                message: "Product not Found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3333/order' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
                error: err
            });
        });
    });
};

//Find order by id from the list and display that particular order details
exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .then(order => {
        if(!order){
            return res.status(404).json({
                    message: "order not found"
            });
        }
        res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3333/order'
                }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}


//Delete an order from the list
exports.orders_delete_order = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3333/order', 
                body: {productId: 'ID', quantity: "Number"}
            }
    });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}