import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium'
    });

    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null); // To track which todo item is being edited
    const [isEditing, setIsEditing] = useState(false); // To track whether we are in edit mode

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:3000/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTodo({
            ...newTodo,
            [name]: value
        });
    };

    const addTodo = async () => {
        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            setNewTodo({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium'
            });
            fetchTodos(); // Fetch updated todo list
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            fetchTodos(); // Fetch updated todo list
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const startEditing = (id) => {
        setIsEditing(true);
        setEditingId(id); // Set the editing id to indicate that a todo item is being edited
        const todoToEdit = tasks.find(todo => todo._id === id);
        setNewTodo({
            title: todoToEdit.title,
            description: todoToEdit.description,
            dueDate: todoToEdit.dueDate,
            priority: todoToEdit.priority
        });
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingId(null); // Reset editing id to indicate no item is being edited
        setNewTodo({
            title: '',
            description: '',
            dueDate: '',
            priority: 'Medium'
        });
    };

    const saveTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
            if (!response.ok) {
                throw new Error('Failed to save todo');
            }
            setIsEditing(false);
            setEditingId(null); // Reset editing id to indicate no item is being edited
            fetchTodos(); // Fetch updated todo list
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    return (
        <>
            <div>
                {!isEditing && (
                    <>
                        <h1>Add New Todo</h1>
                        <input
                            type="text"
                            name="title"
                            value={newTodo.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                        />
                        <input
                            type="text"
                            name="description"
                            value={newTodo.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                        />
                        <input
                            type="date"
                            name="dueDate"
                            value={newTodo.dueDate}
                            onChange={handleInputChange}
                            placeholder="Due Date"
                        />
                        <select
                            name="priority"
                            value={newTodo.priority}
                            onChange={handleInputChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <button onClick={addTodo}>Add Todo</button>
                    </>
                )}
                <ul style={{ listStyle: 'none' }}>
                    <h1>Dajcie mi...</h1>
                    {tasks.map((todo) => (
                        <li key={todo._id} className="todo-item">
                            <div className="todo">
                                {!isEditing && (
                                    <button onClick={() => startEditing(todo._id)}>Edit</button>
                                )}
                                <div className="todo-data">
                                    {editingId === todo._id ? (
                                        // Render input fields if the todo is being edited
                                        <>
                                            <input
                                                type="text"
                                                name="title"
                                                value={newTodo.title}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type="text"
                                                name="description"
                                                value={newTodo.description}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={newTodo.dueDate}
                                                onChange={handleInputChange}
                                            />
                                            <select
                                                name="priority"
                                                value={newTodo.priority}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </>
                                    ) : (
                                        // Render todo details if not being edited
                                        <>
                                            <h3>{todo.title}</h3>
                                            <p>Description: {todo.description}</p>
                                            <p>Due Date: {todo.dueDate}</p>
                                            <p>Priority: {todo.priority}</p>
                                        </>
                                    )}
                                </div>
                                {editingId === todo._id && (
                                    <button onClick={() => saveTodo(todo._id)}>Save</button>
                                )}
                                {!isEditing && (
                                    <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default App;
