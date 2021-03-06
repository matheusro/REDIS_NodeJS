const bodyParser = require('body-parser')

var express = require('express');
var redis = require('redis');

var app = express();
var redisClient = redis.createClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/cart/:user_id', function(req, res){
    var user_id = req.params.user_id
    var cart_name = "cart_"+user_id
    var empty_product = ""

    redisClient.sadd(cart_name, empty_product)
    console.log("New cart created " + cart_name)
    res.sendStatus(200)
});

app.post('/cart/:user_id/products/', function(req, res){
    var user_id = req.params.user_id
    var cart_name = "cart_"+user_id
    var product_id = req.body.product_id

    redisClient.sadd(cart_name, product_id)
    console.log("Product " + product_id + " added to cart " + cart_name)
    res.sendStatus(200)
});

app.delete('/cart/:user_id', function(req, res){
    var user_id = req.params.user_id
    var cart_name = "cart_"+user_id

    redisClient.del(cart_name)
    console.log("Cart deleted " + cart_name)
    res.sendStatus(200)
});

app.delete('/cart/:user_id/products/:product_id', function(req, res){
    var user_id = req.params.user_id
    var cart_name = "cart_"+user_id
    var product_id = req.params.product_id

    redisClient.srem(cart_name, product_id)
    console.log("Product " + product_id + " removed from cart " + cart_name)
    res.sendStatus(200)
});

app.get('/cart/:user_id', function(req, res){
    var user_id = req.params.user_id
    var cart_name = "cart_"+user_id

    redisClient.smembers(cart_name, function(err, products){
        console.log("Products in cart: " + products);
        // //var strProdutos = products + "".;
        // var listaProdutos = products.split(",");

        // for(i=0; i < listaProdutos.length; i++){
        //     res.write(listaProdutos[i]+"<BR>");
        // }
        res.write(""+products);
        res.status(200).end();
      });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});

redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});