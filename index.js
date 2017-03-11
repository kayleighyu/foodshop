var express = require('express');
var server = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

var mongoURI = process.env.MONGOURI || require('./secrets').mongoURI;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(mongoURI);

var foodSchema = mongoose.Schema({
  price: Number,
  category: String,
  isGlutenFree: Boolean,
  calories: Number
});

var Food = mongoose.model('Food', foodSchema);

// var pizza = new Food({
//   price: 20,
//   category: 'pizza',
//   isGlutenFree: false,
//   calories: 800
// });
//
// pizza.save(function(err, data){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

server.get('/foods', function(req, res){
  Food.find({}, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

server.get('/foods/:id', function(req, res){
  Food.find({_id:req.params.id}, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

server.get('/foods/category/:categoryName', function(req, res){
  Food.find({category:req.params.categoryName}, function(err, documents){
    if(err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

server.get('/foods/price/:dollarAmount', function(req, res){
  Food.find({price: req.params.dollarAmount}, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        foods: documents
      });
    }
  });
});

server.post('/foods', function(req, res){
  var food = new Food(req.body);
  food.save(function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(201).json({
        msg: 'New food successfully created'
      });
    }
  });
});

server.put('/foods/:id', function(req, res){
  Food.findOneAndUpdate({_id: req.params.id}, req.body, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Food succesfully updated!'
      });
    }
  });
});

server.delete('/foods/:id', function(req, res){
  Food.remove({_id: req.params.id}, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Food successfully deleted!'
      });
    }
  });
});

server.delete('/foods/category/:category', function(req, res){
  Food.remove({category: req.params.category}, function(err, documents){
    if (err){
      res.status(500).json({
        msg: err
      });
    } else {
      res.status(200).json({
        msg: 'Successfully deleted all foods in the category ' + req.params.category + '!'
      });
    }
  });
});

server.listen(port, function(){
  console.log('Now listening on port...', port);
});
