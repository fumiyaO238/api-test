import express, { Application, Request, Response } from "express";
import cors from "cors";
import { uid } from "uid";
import mysql from "mysql2";

//接続するDBの情報
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password123!",
  database: "api_blogs",
});

const app: Application = express();
const PORT = 3333;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//getリクエスト
app.get('/', (req: Request, res: Response) => {
  console.log("getリクエストを受け付けました。");
  const sql = "SELECT * FROM  blog";
  connection.query(sql, (error, result) => {
    if(error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ blogs: result });
    }
  })
});

//postリクエスト
app.post("/add", (req: Request, res: Response) => {
  console.log("postリクエストを受け付けました。");
  // console.log(req.body.data)
  const { blog } = req.body.data;
  const id = "id1"
  const sql = `INSERT INTO blog (content, user_id) VALUES ("${ blog }", "${id}")`;

  connection.query(sql, (error, result) => {
    if(error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to add blog"});
    }
    res.status(200).json({ blogs: result });
  })
});

//deleteリクエスト
app.delete("/delete", (req: Request, res: Response) => {
  console.log("deleteリクエストを受け付けました。");
  console.log(req.body.id);
  const id = req.body.id;
  const sql = `DELETE FROM blog WHERE id="${id}"`;
  connection.query(sql, (error) => {
    if(error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(200).json({ message: "success" });
    }
  })
})

//putリクエスト
app.put("/update", (req: Request, res: Response) => {
  console.log("putリクエストを受け付けました。");
  console.log(req.body.data);
  const { id, todo } = req.body.data;
  const sql = `UPDATE todo SET todo="${todo} WHERE id="${id}"`;
  connection.query(sql, (error) => {
    if(error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ id, todo });
    }
  })
})

try {
  app.listen(PORT, () => {
    console.log(`server running at://localhost:${PORT}`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}