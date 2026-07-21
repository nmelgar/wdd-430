const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description.trim(),
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title !== undefined && !updates.title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        ...updates,
        title: updates.title !== undefined ? updates.title.trim() : undefined,
        description:
          updates.description !== undefined
            ? updates.description.trim()
            : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
