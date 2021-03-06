'use strict'; // enable let

// DEPENDENCIES

const pjson = require('./package.json');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const ejs = require('ejs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


// CONSTANTS

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;
const SERVER_MSG = `Serving ${pjson.name} on port ${PORT}`;
// const DEFAULT_MONGO_URL =('mongodb://blog20:blog20@ds243931.mlab.com:43931/blog11',{useMongoClient: true});
// const MONGO_URL = process.env.MONGO_URL || DEFAULT_MONGO_URL;
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    imageUrl: String,
    body: String,
    created: { type: Date, default: Date.now }
});
const Blog = mongoose.model('blog', blogSchema);

const subSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String
});
const Subscription = mongoose.model('subscription', subSchema);

// SETTINGS

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
ejs.delimiter = '?';
mongoose.connect('mongodb://omar:debate1024@ds247141.mlab.com:47141/gd-news', { useMongoClient: true });

// VARIABLES

// SERVER

app.listen(PORT, function() {
    console.log(SERVER_MSG);
});

// ROUTES

app.get('/', function(req, res) {
    res.redirect('/blogs');
});

// index route
app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log('ERROR:', err);
        } else {
            res.render('index', { blogs: blogs});
        }
    });
});

// archive route
app.get('/blogs/archive', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log('ERROR:', err);
        } else {
            res.render('archive', { blogs: blogs});
        }
    });
});

// about&contact route
app.get('/blogs/about-contact', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log('ERROR:', err);
        } else {
            res.render('about-contact', { blogs: blogs});
        }
    });
});
// create signup route
app.post('/blogs', function(req, res) {
    const requestedSub = req.body.subscription;
    requestedSub.body = req.sanitize(requestedSub.body);

    console.log(requestedSub);

    Subscription.create(requestedSub, function(err, createdSub) {
        if (err) {
            res.render('about-contact');
        } else {
            res.redirect('/blogs');
        }
    });

});

// new route
app.get('/blogs/new', function(req, res) {
    res.render('new');
});

// create route
app.post('/blogs', function(req, res) {
    const requestedBlog = req.body.blog;
    requestedBlog.body = req.sanitize(requestedBlog.body);

    console.log(requestedBlog);

    Blog.create(requestedBlog, function(err, createdBlog) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });

});

// show route
app.get('/blogs/:id', function(req, res) {
    const id = req.params.id;

    Blog.findById(id, function(err, foundBlog) {
        if (err) {
            console.log('ERROR:', err);
            res.redirect('/blogs');
        } else {
            res.render('show', { blog: foundBlog });
        }
    });
});

// edit route
app.get('/blogs/:id/edit', function(req, res) {
    const id = req.params.id;

    Blog.findById(id, function(err, foundBlog) {
        if (err) {
            console.log('ERROR', err);
            res.redirect('/blogs');
        } else {
            res.render('edit', { blog: foundBlog });
        }
    });
});

// update route
app.put('/blogs/:id', function(req, res) {
    const id = req.params.id;
    const requestedBlog = req.body.blog;
    requestedBlog.body = req.sanitize(requestedBlog.body);

    Blog.findByIdAndUpdate(id, requestedBlog, function(err, updatedBlog) {
        if (err) {
            console.log('ERROR:', err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + id);
        }
    });
});

// destroy route
app.delete('/blogs/:id/', function(req, res) {
    const id = req.params.id;

    Blog.findByIdAndRemove(id, function(err) {
        if (err) {
            console.log('ERROR:', err);
        }
        res.redirect('/blogs');
    });
});

// FUNCTIONS

// MAIN