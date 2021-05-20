require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoTemplate = require('./model/todo');
const httpErrors = require('./httpError');
const app = express();

app.use(express.json());
app.use(cors());
app.listen(3000, ()=>{
    console.log("PORT 3000 is connected!!")
})

app.get('/', async (req, res)=>{
    res.redirect('/todos')
})

//get allTodos
    app.get('/todos', async (req, res)=>{
        try{
            const getTodos = await TodoTemplate.find({})
            return res.json(getTodos);
        }catch(e){
            return new httpErrors(500, "No any todos in the database")
        }
    })

//post newTodo
    app.post('/todos', async (req, res)=>{
        try{
            const addTodo = new TodoTemplate(req.body);
            await addTodo.save();
            return res.json(addTodo);
        }catch(e){
            return new httpErrors(500, "Failed to add new todo")
        }
    })

//edit todo
app.put('/todos/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const editTodo = await TodoTemplate.findByIdAndUpdate(id, req.body, {new: true});
        return res.json(editTodo);
    }catch(e){
        return new httpErrors(500, "Failed to edit todo")
    }
})

//update todo
    app.put('/todos/:id', async(req, res)=>{
        try{
            const {id} = req.params;
            const updateTodo = await TodoTemplate.findByIdAndUpdate(id, req.body, {new: true});
            return res.json(updateTodo);
        }catch(e){
            return new httpErrors(500, "Failed to update todo")
        }
    })

//delete todo
    app.delete('/todos/:id', async(req, res)=>{
        try{
            const {id} = req.params;
            const deleteTodo = await TodoTemplate.findByIdAndDelete(id);
            return res.json(deleteTodo);
        }catch(e){
            return new httpErrors(500, "Failed to delete todo")
        }
    })

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
