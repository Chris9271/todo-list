import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, FormControl, InputGroup, Container, Modal} from 'react-bootstrap';
import './scss/style.scss';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [show, setShow] = useState(false);
  const [editTodos, setEditTodos] = useState("");

  const handleOpen = () => setShow(true)
  const handleClose = () => setShow(false)
  
  useEffect(()=>{
    const allTodos = async() =>{
      const getTodos = await axios.get('http://localhost:3000/todos');
      setTodos(getTodos.data)
    }
    allTodos();
  },[])

  const addTodo = async(e) => {
    e.preventDefault();
    if(todos.some(todo => todo.task === newTodo)){
      alert(`This todo is already exist`)
    }else{
      const newTodos = await axios.post('http://localhost:3000/todos', {task: newTodo.trim()});
      setTodos([...todos, newTodos.data]);
      setNewTodo("")
    }
  }

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const updateStatus = {
      completed: !todos.find(todo => todo._id === id).completed
    }
    const updateItem = await axios.put(`http://localhost:3000/todos/${id}`, updateStatus);
    const updateData = updateItem.data;
    console.log(updateData);
    setTodos(todos.map(todoData => todoData._id === id ? updateData : todoData))
  }

  const deleteTodo = async(e, id) => {
    e.stopPropagation();
    const deleteItem = await axios.delete(`http://localhost:3000/todos/${id}`);
    console.log(deleteItem);
    setTodos(todos.filter(todo => todo._id !== id));
  }

  const editTodo = async(e, id) => {
    e.stopPropagation();
    const editItem = await axios.put(`http://localhost:3000/todos/${id}`, {task: editTodos.trim()})
    console.log(editItem.data);
    setShow(false);
    window.location.reload();
  }

  return(
    <div className="App">
      <Container fluid>
      <h2>TODO LIST</h2>
      <section>
        <InputGroup className="mb-3">
          <FormControl
            onChange={(e)=>setNewTodo(e.target.value)}
            value={newTodo}
          />
            <Button variant="light" onClick={addTodo}>
              <img src="https://img.icons8.com/android/18/000000/plus.png" alt="plus" className="plus"/>
            </Button>
        </InputGroup>
      </section>
      <ul>
          {todos.map((todo, i) => (
            <li
              key={i}
              className={todo.completed ? "completed" : ""}
            >
              <div className="todos" onClick={(e)=>updateTodo(e, todo._id)}>
                {todo.task}
              </div>
              <div className="icons">
                <div>
                  <img 
                    src="https://img.icons8.com/metro/24/000000/trash.png" 
                    onClick={(e)=>deleteTodo(e, todo._id)}
                    alt="delete"
                    className="delete"
                  />
                </div>
                <div>
                  <img src="https://img.icons8.com/material-two-tone/24/000000/edit--v1.png"
                    alt="edit"
                    className="edit"
                    onClick={handleOpen}
                  />
                </div>
{/* Because bootstrap modal animation lead to "findDOMNode is deprecated in StrictMode" warning happen so set to false */}
                <Modal show={show} onHide={handleClose} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <InputGroup className="mb-3">
                    <FormControl
                      onChange={(e)=>setEditTodos(e.target.value)}
                      value={editTodos}
                    />
                    <Button variant="light" onClick={(e) => editTodo(e, todo._id)}>update</Button>
                    </InputGroup>
                  </Modal.Body>
                </Modal>
              </div>
            </li>
          ))}
      </ul>
      </Container>
    </div>
  )
}

export default App;
