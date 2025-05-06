import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();
import authRoutes from './routes/auth.js';


const app = express();
app.use('/api', authRoutes);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LostFinder backend is running.");
});

app.get("/test", (req, res) => {
  res.send("Server is working!");
});


// ⬇️ 用 IIFE 包起來，才能使用 await
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" 資料庫連線成功！");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" 資料庫連線失敗：", error);
  }
})();
