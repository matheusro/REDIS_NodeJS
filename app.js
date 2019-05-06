var express = require('express');
var redis = require('redis');
var app = express();
var client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

app.get('/', function (req, res) {
    client.get('first_time_visitor', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }

        console.log(result);

        if (result == null || result == 1) {
            client.set('first_time_visitor', 0, redis.print);
            res.send('Hello new visitor!');
        }
        else{
            res.send('Hello visitor!');
        }
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});