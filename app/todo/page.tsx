// 


















"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatPanel } from "@/components/chat/ChatPanel";

interface TodoItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | null;
}

const BACKEND_URL = "https://todoapp-backend-1cgx.onrender.com/api/v1";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const getTodoId = (todo: TodoItem): string => todo.id || todo._id || "";

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      console.log('[TodoApp] Fetching todos from:', `${BACKEND_URL}/`);
      
      const response = await fetch(`${BACKEND_URL}/?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('[TodoApp] Response status:', response.status);
      
      if (!response.ok) throw new Error("Failed to fetch todos");
      
      const data = await response.json();
      console.log('[TodoApp] Fetched todos:', data);
      
      // Handle different response formats
      const todosArray = data.todos || data.data || data || [];
      setTodos(todosArray);
      setError(null);
    } catch (err) {
      console.error('[TodoApp] Fetch error:', err);
      setError((err as Error).message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Refresh todos without loading spinner (for chat updates)
  const refreshTodos = async () => {
    console.log('[TodoApp] Refreshing todos after chat action...');
    await fetchTodos(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE
      try {
        const response = await fetch(`${BACKEND_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            dueDate: editDueDate || undefined,
            priority: editPriority,
          }),
        });

        if (!response.ok) throw new Error("Failed to update todo");

        const updatedTodo = await response.json();
        setTodos(todos.map(t => getTodoId(t) === editingId ? updatedTodo : t));
        setEditingId(null);
        resetForm();
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    } else {
      // ADD
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
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this task?")) return;

    const beforeDelete = [...todos];
    try {
      // Optimistic update
      setTodos(todos.filter(t => getTodoId(t) !== id));
      
      const response = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setTodos(beforeDelete);
        throw new Error("Delete failed");
      }
      setError(null);
    } catch (err) {
      setTodos(beforeDelete);
      setError((err as Error).message);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const beforeToggle = [...todos];

    try {
      // Optimistic update
      setTodos(
        todos.map(t =>
          getTodoId(t) === id ? { ...t, completed: !completed } : t
        )
      );

      const response = await fetch(`${BACKEND_URL}/${id}/toggle-complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) throw new Error("Failed to toggle");
      setError(null);
    } catch (err) {
      setTodos(beforeToggle);
      setError((err as Error).message);
    }
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(getTodoId(todo));
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditDueDate(todo.dueDate || "");
    setEditPriority(todo.priority || "medium");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
    setEditPriority("medium");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <div className="container mx-auto max-w-4xl">
            <header className="mb-8 text-center py-6">
              <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mt-3 animate-pulse" />
            </header>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <AppSidebar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="container mx-auto max-w-4xl">
          
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-bold">
                ✕
              </button>
            </div>
          )}

          {/* Header */}
          <header className="mb-8 text-center py-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Todo App</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Organize your tasks efficiently</p>
          </header>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingId ? "Edit Todo" : "Add New Todo"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingId ? editTitle : title}
                    onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <select
                    value={editingId ? editPriority : priority}
                    onChange={(e) => editingId ? setEditPriority(e.target.value as any) : setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={editingId ? editDescription : description}
                  onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add description (optional)"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="datetime-local"
                  value={editingId ? editDueDate : dueDate}
                  onChange={(e) => editingId ? setEditDueDate(e.target.value) : setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex space-x-3">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingId ? "Update Todo" : "Add Todo"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Task List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Tasks ({filteredTodos.length})
              </h2>

              <input
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-3">
              {filteredTodos.map(todo => {
                const id = getTodoId(todo);

                return (
                  <div
                    key={id}
                    className={`border p-4 rounded-lg transition-all ${
                      todo.completed 
                        ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" 
                        : "dark:border-gray-700 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(id, todo.completed)}
                          className="h-5 w-5 mt-1 cursor-pointer"
                        />

                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${
                            todo.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
                          }`}>
                            {todo.title}
                          </h3>

                          {todo.description && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                              {todo.description}
                            </p>
                          )}

                          <div className="flex gap-2 mt-2 flex-wrap">
                            {todo.priority && (
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityClass(todo.priority)}`}>
                                {todo.priority.toUpperCase()}
                              </span>
                            )}

                            {todo.dueDate && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded font-medium">
                                Due: {formatDate(todo.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 items-start ml-2">
                        <button 
                          onClick={() => startEditing(todo)} 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium text-sm"
                        >
                          Edit
                        </button>

                        <button 
                          onClick={() => handleDelete(id)} 
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTodos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  {searchQuery ? "No matching tasks found." : "No tasks yet. Create one above!"}
                </p>
                {!searchQuery && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Or use the chat assistant to add tasks
                  </p>
                )}
              </div>
            )}
          </div>

          <footer className="mt-8 text-center text-gray-600 dark:text-gray-400 pb-4">
            Todo App © {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onTaskUpdate={refreshTodos}
      />
    </div>
  );
}