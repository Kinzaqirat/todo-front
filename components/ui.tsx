"use client";

import { useState, useEffect } from "react";

// Updated Interface: Handles both '_id' (Mongo) and 'id' (Standard JSON)
interface TodoItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

const BACKEND_URL = "https://todoapp-backend-1cgx.onrender.com/api/v1";

export default function TodoApp() {
  // State for todos
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium");

  // Helper Function: Safely gets the ID regardless of what the backend sends
  const getTodoId = (todo: TodoItem): string => {
    return todo.id || todo._id || "";
  };

  // Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data.todos || data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing todo
      try {
        const response = await fetch(`${BACKEND_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle || "",
            description: editDescription,
            dueDate: editDueDate || undefined,
            priority: editPriority,
          }),
        });

        if (!response.ok) throw new Error("Failed to update todo");

        const updatedTodo = await response.json();
        setTodos(todos.map(todo => getTodoId(todo) === editingId ? updatedTodo : todo));
        setEditingId(null);
        resetForm();
      } catch (err) {
        setError((err as Error).message);
      }
    } else {
      // Add new todo
      try {
        const response = await fetch(`${BACKEND_URL}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, dueDate, priority }),
        });

        if (!response.ok) throw new Error("Failed to add todo");

        const newTodo = await response.json();
        setTodos([newTodo, ...todos]);
        resetForm();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this task?")) return;

    const todosBeforeDelete = [...todos];
    try {
      setTodos(todos.filter(todo => getTodoId(todo) !== id)); // Optimistic UI update
      const response = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setTodos(todosBeforeDelete); // Revert if failed
        throw new Error("Failed to delete todo");
      }
    } catch (err) {
      setTodos(todosBeforeDelete);
      setError((err as Error).message);
    }
  };

  // ✅ Toggle Complete Feature
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    if (!id) return;

    const todosBeforeToggle = [...todos];

    try {
      // 1. Optimistic UI Update: Flip status immediately
      setTodos(todos.map(todo => 
        getTodoId(todo) === id ? { ...todo, completed: !currentStatus } : todo
      ));

      // 2. API Call to specific toggle endpoint
      const response = await fetch(`${BACKEND_URL}/${id}/toggle-complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Sending body just in case backend expects it, though endpoint name implies toggle
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      // 3. Revert if API fails
      setTodos(todosBeforeToggle);
      setError((err as Error).message);
    }
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(getTodoId(todo));
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditDueDate(todo.dueDate || "");
    setEditPriority(todo.priority);
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setDueDate(""); setPriority("medium");
    setEditTitle(""); setEditDescription(""); setEditDueDate(""); setEditPriority("medium");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Search Logic: Filter todos based on query
  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Reload</button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8 text-center py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Todo App</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Organize your tasks efficiently</p>
        </header>

        {/* Add/Edit Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {editingId ? "Edit Todo" : "Add New Todo"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={editingId ? editTitle : title}
                  onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={editingId ? editPriority : priority}
                  onChange={(e) => editingId ? setEditPriority(e.target.value as any) : setPriority(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={editingId ? editDescription : description}
                onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={editingId ? editDueDate : dueDate}
                onChange={(e) => editingId ? setEditDueDate(e.target.value) : setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                {editingId ? "Update Todo" : "Add Todo"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEditing} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              My Tasks ({filteredTodos.length})
            </h2>
            
            {/* ✅ Search Bar UI */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? "No matching tasks found." : "No tasks found. Add a new task to get started!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => {
                const todoId = getTodoId(todo);
                return (
                  <div key={todoId} className={`border rounded-lg p-4 transition-all ${todo.completed ? "bg-green-50 border-green-200 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todoId, todo.completed)}
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}>
                            {todo.title}
                          </h3>
                          {todo.description && <p className="mt-1 text-gray-600 dark:text-gray-400">{todo.description}</p>}
                          <div className="flex flex-wrap gap-2 mt-2">
                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(todo.priority)}`}>
                               {todo.priority}
                             </span>
                             {todo.dueDate && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Due: {formatDate(todo.dueDate)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button onClick={() => startEditing(todo)} className="text-blue-600 hover:text-blue-800">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(todoId)} className="text-red-600 hover:text-red-800">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <footer className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Todo App © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}