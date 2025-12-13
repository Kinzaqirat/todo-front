"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";

// Updated Interface
interface TodoItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
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

  const getTodoId = (todo: TodoItem): string => todo.id || todo._id || "";

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/`);
      if (!response.ok) throw new Error("Failed to fetch todos");
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
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this task?")) return;

    const beforeDelete = [...todos];
    try {
      setTodos(todos.filter(t => getTodoId(t) !== id));
      const response = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setTodos(beforeDelete);
        throw new Error("Delete failed");
      }
    } catch (err) {
      setTodos(beforeDelete);
      setError((err as Error).message);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const beforeToggle = [...todos];

    try {
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
    setEditPriority(todo.priority);
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
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-blue-500 rounded-full"></div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* SIDEBAR */}
      <AppSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-0 overflow-y-auto h-screen">
        <div className="container mx-auto max-w-4xl">

          {/* HEADER */}
          <header className="mb-8 text-center py-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Todo App</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Organize your tasks efficiently</p>
          </header>

          {/* FORM */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingId ? "Edit Todo" : "Add New Todo"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingId ? editTitle : title}
                    onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={editingId ? editPriority : priority}
                    onChange={(e) => editingId ? setEditPriority(e.target.value as any) : setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={2}
                  value={editingId ? editDescription : description}
                  onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="datetime-local"
                  value={editingId ? editDueDate : dueDate}
                  onChange={(e) => editingId ? setEditDueDate(e.target.value) : setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  {editingId ? "Update Todo" : "Add Todo"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* TASK LIST */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Tasks ({filteredTodos.length})
              </h2>

              <input
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white w-64 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {filteredTodos.map(todo => {
              const id = getTodoId(todo);

              return (
                <div
                  key={id}
                  className={`border p-4 rounded-lg mb-3 ${todo.completed ? "bg-green-50 dark:bg-green-900/10" : "dark:border-gray-700"}`}
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(id, todo.completed)}
                        className="h-5 w-5 mt-1"
                      />

                      <div>
                        <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${todo.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                          {todo.title}
                        </h3>

                        {todo.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{todo.description}</p>
                        )}

                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityClass(todo.priority)}`}>
                            {todo.priority.toUpperCase()}
                          </span>

                          {todo.dueDate && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                              Due: {formatDate(todo.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 items-start">
                      <button onClick={() => startEditing(todo)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">
                        Edit
                      </button>

                      <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTodos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery ? "No matching tasks found." : "No tasks yet. Create one above!"}
                </p>
              </div>
            )}
          </div>

          <footer className="mt-8 text-center text-gray-600 dark:text-gray-400 pb-4">
            Todo App © {new Date().getFullYear()}
          </footer>

        </div>
      </div>
    </div>
  );
}
