/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import SignIn from "../components/SignIn";
import ModalEdit from "../components/ModalEdit";

function AppFast() {
    if (sessionStorage.getItem("user") === null) {
        var getuser = false;
    } else {
        getuser = JSON.parse(sessionStorage.getItem("user"));
        document.cookie = "username="+getuser.user.email+"; path=/";
    }
    const endPoint="http://127.0.0.1:8000/task/"
    useEffect(() => {
        fetchTodos();
    }, []);
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    
    const fetchTodos = async () => {
        try {
            const response = await axios.get(endPoint);
            setTodos(response.data);
            console.log(response.data);
        } catch (error) {
        console.error("Error fetching todos:", error);
        }
  }; 
  
    const deleteTodo = async (id) => {
        try {
            await axios.delete(endPoint+id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };
    const handleAddTodo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(endPoint, 
                {   title: newItem,
                    description: newItem,
                    completed: "false"
                }
            );
          alert("Success");
          fetchTodos();
        } catch (err) {
          alert('Error adding todo:', err);
        }
    };

    const getTodoById = async (id) => {
      try {
        const response = await axios.get(endPoint+id);
        setSelectedTodo(response.data);
      } catch (error) {
        console.error('Error fetching todo by ID:', error);
      }
    };
    const handleToggleCompletion = async (id) => {
      getTodoById(id)
      console.log(selectedTodo)
      try {
          //await axios.put(endPoint+id);
          setTodos(todos.filter(todo => todo.id !== id));
          //const response = await axios.put(endPoint+id, 
          //  {   title: newItem,
          //      description: newItem,
          //      completed: "false"
          //  }
        //x);
        alert("Success");
      } catch (error) {
          console.error('Error Editing todo:', error);
      }
     
  
    };
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log("Filter changed to:", newFilter);
  };
  const getFilteredTodos = () => {
    console.log("Filtering todos:", filter);
    switch (filter) {
      case "completed":
        console.log(todos)
        return todos.filter((todo) => JSON.parse(todo.completed.toLowerCase()));
      case "uncompleted":
        return todos.filter((todo) => !JSON.parse(todo.completed.toLowerCase()));
      default:
        return todos;
    }
  };

  

  const handleSaveEdit = (id) => {
    if (!editText.trim()) {
      return;
    }
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo))
    );
    setIsEditing(null);
    setEditText("");
  };
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditText("");
  };

  return (
    <>
      {getuser ? (
        <div>
          <div className="app bg-gray-600 min-h-screen flex flex-col justify-center items-center">
            <div className="text-lg">Hello, {getuser.user.displayName}!</div>
            <h1>To Do App with FastAPI</h1>
            <form
              onSubmit={handleAddTodo}
              className="new-item-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <label
                htmlFor="new-item-input"
                className="block text-gray-700 text-4xl font-extrabold "
              >
                To Do App
              </label>
              <input
                id="new-item-input"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add
              </button>
            </form>
            <div className="filters mb-4">
              <button
                onClick={() => handleFilterChange("all")}
                className={`filter-btn ${
                  filter === "all" ? "bg-blue-500" : "bg-gray-300"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("completed")}
                className={`filter-btn ${
                  filter === "completed" ? "bg-blue-500" : "bg-gray-300"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                Completed
              </button>
              <button
                onClick={() => handleFilterChange("uncompleted")}
                className={`filter-btn ${
                  filter === "uncompleted" ? "bg-blue-500" : "bg-gray-300"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                Uncompleted
              </button>
            </div>
            <h1 className="header text-2xl font-bold underline">Todo List</h1>

            <ul>
              {getFilteredTodos().map((todo) => (
                <li
                  key={todo.id}
                  className={`list-item ${
                    todo.isCompleted ? "line-through" : ""
                  } bg-white flex items-center shadow-lg mb-2 p-4 rounded decoration-red-900`}
                >
                  {isEditing === todo.completed.toLowerCase() ? (
                    <div className="edit-form flex">
                      <input
                        type="text"
                        className="text-gray-700 flex-1 p-2 border rounded"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="btn btn-save"
                        onClick={() => handleSaveEdit(todo.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="todo-container flex justify-between items-center">
                      <label className="todo-label flex items-center">
                        <input
                          type="checkbox"
                          className="todo-checkbox mr-2"
                          checked={JSON.parse(todo.completed.toLowerCase())}
                          onChange={() => handleToggleCompletion(todo.id)}
                        />
                        <span className="text-gray-950">{todo.title}</span>
                      </label>
                      <div>
                        <button
                          className="btn-alert bg-amber-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-l"
                          onClick={() => openEditModal(todo)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-danger bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-r"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            <ModalEdit
              isOpen={editModalOpen}
              closeModal={closeEditModal}
              taskId={selectedTask.id}
              task={selectedTask.data}
            />
          </div>
        </div>
      ) : (
        <>
          <SignIn />
        </>
      )}
    </>
  );
}
export default AppFast;
