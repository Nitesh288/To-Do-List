import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './Todo.css'; // Make sure to import the CSS file

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: uuidv4(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'name') {
      return a.text.localeCompare(b.text);
    } else if (sort === 'status') {
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <div className="todo-container">
        <div className="input-group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
            placeholder="Enter a new task"
          />
          <button onClick={addTask} className="add-button">
            <FaPlus className="icon" />
            Add
          </button>
        </div>
        <div className="filter-sort-group">
          <div className="filter-group">
            <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>
              All
            </button>
            <button onClick={() => setFilter('active')} className={`filter-button ${filter === 'active' ? 'active' : ''}`}>
              Active
            </button>
            <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>
              Completed
            </button>
          </div>
          <select onChange={(e) => setSort(e.target.value)} className="sort-select" value={sort}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
        <ul className="task-list">
          {sortedTasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span className={`task-text ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </span>
              <div className="button-group">
                <button onClick={() => toggleCompletion(task.id)} className="complete-button">
                  {task.completed ? <FaCheck className="icon" /> : ''}
                  {task.completed ? `Completed` : `Complete`}
                </button>
                <button onClick={() => removeTask(task.id)} className="delete-button">
                  <FaTrash className="icon" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
