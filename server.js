// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
var session = require("express-session");
app.use(session({secret: "yamakemykokorogodokidokidonchaknow"}));

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

// Use native promises
mongoose.Promise = global.Promise;

const moment = require('moment');

var QuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true, maxlength: 20},
    text: { type: String, required: true, maxlength: 255 },
    created_at: { type: Date, default: moment() },
   });
   mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
   var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'   

app.get('/', function(req, res) {
    context = {};
    if(req.session.errors) {
        console.log("THERE ARE PROBLEMS");
        context['errors'] = req.session.errors;
        req.session.errors = undefined;
    }
    res.render('index', context);
})

app.post('/process', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote(req.body);
    console.log(quote);
    quote.save(function(err){
        if(err){
            req.session.errors = quote.errors;
            res.redirect('/');
        }
        else {
            res.redirect('/quotes');
        }
    });
})

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes) {
        if(err) {
            console.log(err);
        }
        context = {};
        context['quotes'] = quotes;
        context['moment'] = moment;
        res.render('quotes', context);
    });
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
