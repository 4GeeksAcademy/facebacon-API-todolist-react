import React, { useEffect, useState } from 'react';

const Home = () => {
	const [tasks, setTasks] = useState([]); // State for managing tasks
	const [inputValue, setInputValue] = useState(''); // State for input field
  
	const API_BASE_URL = 'https://playground.4geeks.com/todo';
	const USERNAME = 'facebacon';
  
	// Initialize user and fetch tasks on component mount
	useEffect(() => {
	  const initializeUser = async () => {
		try {
		  // create user if no exists
		  await fetch(`${API_BASE_URL}/users/${USERNAME}`, { method: 'POST' });
  
		  // Fetch user tasks
		  const response = await fetch(`${API_BASE_URL}/users/${USERNAME}`);
		  if (!response.ok) throw new Error('Failed to fetch tasks');
		  const data = await response.json();
		  setTasks(data.todos.map(todo => todo.label)); // Extract task labels
		} catch (error) {
		  console.error('Error initializing user or fetching tasks:', error);
		}
	  };
  
	  initializeUser(); // initialize the fucntion after defining it
	}, []); // Only call the function once
  
	//Function to handle input change
	//On the event 
	//Write the input on the input box 
	const handleInputChange = (e) => {
	  setInputValue(e.target.value);
	};
  
	// Function to handle key press (Enter key)
	// On the event
	// Pressing Enter
	// Run POST and set the status to is_done false
	const handleKeyPress = async (e) => {
	  if (e.key === 'Enter' && inputValue.trim() !== '') {
		try {
		  // Add new task to the server
		  const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label: inputValue, is_done: false }),
		  });
  
		  if (!response.ok) throw new Error('Failed to add task');
  
		  // Update local state with the new task aka make visual changes and update the set tasks array on local
		  setTasks((prevTasks) => [...prevTasks, inputValue]);
		  setInputValue(''); // Clear input field
		} catch (error) {
		  console.error('Error adding task:', error);
		}
	  }
	};
  
	// Delete task
	const deleteTask = async (index) => {
	  try {
		const taskToDelete = tasks[index];
  
		// Find the task id on the server using the task label (as our tasks are strings)
		const response = await fetch(`${API_BASE_URL}/users/${USERNAME}`);
		if (!response.ok) throw new Error('Failed to fetch tasks for deletion');
		const data = await response.json();
		const taskId = data.todos.find(todo => todo.label === taskToDelete)?.id; //The optional chaining operator accesses the id property of the returned task object. - Need help understanding this further
  
		if (!taskId) return; // If task id not found, return
  
		// Delete the task from the server
		await fetch(`${API_BASE_URL}/todos/${taskId}`, { method: 'DELETE' });
  
		// Update local state
		setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index)); // checks that the element that is deleted is not included in the new array created
	  } catch (error) {
		console.error('Error removing task:', error);
	  }
	};
  
	// Clean all tasks
	const cleanAllTasks = async () => {
	  try {
		await fetch(`${API_BASE_URL}/users/${USERNAME}`, { method: 'DELETE' });
  
		// Clear local state
		setTasks([]);
	  } catch (error) {
		console.error('Error cleaning all tasks:', error);
	  }
	};
  
	return (
	  <div className="todo-container">
		<h1>todo</h1>
		<div className="input-container">
		  <input
			type="text"
			placeholder="What needs to be done?"
			value={inputValue}
			onChange={handleInputChange}
			onKeyDown={handleKeyPress}
		  />
		</div>
		<ul className="task-list">
		  {tasks.length === 0 ? (
			<li>No tasks, add a task</li>
		  ) : ( //if no tasks displaytext
			
			// keep track of order of the tasks 
			tasks.map((task, index) => ( 
			  <li key={index} className="task-item">
				{task} 
				<button
				  className="delete-button"
				  onClick={() => deleteTask(index)}
				>
				  X
				</button>
			  </li>
			))
		  )}
		</ul>
		<div className="task-count">
		  {tasks.length} {tasks.length === 1 ? 'item' : 'items'} left
		</div>
		<button onClick={cleanAllTasks}>Clean All Tasks</button>
	  </div>
	);
  };

export default Home;