import { pool } from "../config/db.js";

export const createTask = async (req, res) => {
  const { task_name, description } = req.body;
  const userId = req.user.id;
  try {
    if (!task_name) {
      return res.status(400).json({ message: "Task name is required!" });
    }
    const query = `
      INSERT INTO Tasks (task_name, description, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [task_name, description, userId]);
    return res.status(201).json({ message: "Task created!", task: rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const readAllTasks = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  try {
    let query;
    let values;

    if (userRole === "admin") {
      query = "SELECT * FROM Tasks ORDER BY created_at DESC";
      values = [];
    } else {
      query = "SELECT * FROM Tasks WHERE user_id = $1 ORDER BY created_at DESC";
      values = [userId];
    }

    const { rows } = await pool.query(query, values);
    return res.status(200).json({
      role: userRole,
      count: rows.length,
      tasks: rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const readSingleTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query;
    let values;

    if (userRole === "admin") {
      query = "SELECT * FROM Tasks WHERE id = $1";
      values = [id];
    } else {
      query = "SELECT * FROM Tasks WHERE id = $1 AND user_id = $2";
      values = [id, userId];
    }

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          userRole === "admin"
            ? "Task not found"
            : "Task not found or unauthorized!",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { task_name, description, is_completed } = req.body;

  try {
    const taskExists = await pool.query(
      "SELECT * FROM Tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (taskExists.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized!" });
    }

    const oldTask = taskExists.rows[0];

    const updatedName = task_name || oldTask.task_name;
    const updatedDesc = description || oldTask.description;
    const updatedStatus =
      is_completed !== undefined ? is_completed : oldTask.is_completed;

    const query = `
      UPDATE Tasks 
      SET task_name = $1, description = $2, is_completed = $3 
      WHERE id = $4 AND user_id = $5 
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [
      updatedName,
      updatedDesc,
      updatedStatus,
      id,
      userId,
    ]);

    return res.status(200).json({ message: "Task updated!", task: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query;
    let values;

    if (userRole === "admin") {
      query = "DELETE FROM Tasks WHERE id = $1";
      values = [id];
    } else {
      query = "DELETE FROM Tasks WHERE id = $1 AND user_id = $2";
      values = [id, userId];
    }

    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0)
      return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
