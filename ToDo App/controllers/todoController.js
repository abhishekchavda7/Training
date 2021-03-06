var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb+srv://test:test@cluster0.lgqco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

//create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

    app.get('/todo', function(req, res){

            Todo.find({}, function(err,data){
                    if (err) throw err;
                    res.render('todo', {todos: data});
            });
    });


    app.post('/todo', urlencodedParser, function(req, res){
            //get data from the view and add it to mongodb
            var newTodo = Todo(req.body).save(function(err,data){
                    if (err) throw err;
                    res.json(data);
            });
          
    });


    app.delete('/todo/:item', function(req, res){
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
                if (err) throw err;
                res.json(data);
        });
      
    });
}
