import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { email, password, role = "client" } = req.body;
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExist.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const { rows } = await pool.query(
      `
      INSERT INTO Users (email, password, role) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, role;
    `,
      [email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User created successfully!",
      user: rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found!" });

    const user = rows[0];

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: process.env.SECURE === "true",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  try {
    const query = `
      SELECT 
        u.id, u.email, u.role, u.created_at,
        json_agg(t.*) as user_tasks
      FROM Users u
      LEFT JOIN Tasks t ON u.id = t.user_id
      GROUP BY u.id;
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      message: "All users fetched successfully",
      users: rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, role FROM Users WHERE id = $1",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;
  const adminRole = req.user.role;

  try {
    if (adminRole !== "admin" && adminId !== parseInt(id)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this user" });
    }

    const { rowCount } = await pool.query("DELETE FROM Users WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (adminId === parseInt(id)) {
      res.clearCookie("token");
    }

    res
      .status(200)
      .json({ message: "User and their tasks deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
