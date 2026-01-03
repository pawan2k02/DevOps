import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import createTablesQuery from "../model/schema.js";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    // 1. Connection check
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ PostgreSQL Connected: ${res.rows[0].now}`);

    // 2. Tables Create
    await pool.query(createTablesQuery);
    console.log("✅ Database Tables are ready!");
  } catch (error) {
    console.error("❌ Postgres Connection Error:", error.message);
    process.exit(1);
  }
};

export { pool, connectDB };
export default connectDB;
