import express, { Application, Request, Response } from "express";
import cors from "cors";
import { uid } from "uid";
import mysql from "mysql2";
import GetDateTime from "./util/GetDateTime"

//接続するDBの情報
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password123!",
  database: "api_blogs",
});

const jwt = require("jsonwebtoken");

const app: Application = express();
const PORT = 3333;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* home */
// getリクエスト
app.get('/', (req: Request, res: Response) => {
  console.log("getリクエストを受け付けました。");
  const sql = "SELECT * FROM  blog";
  connection.query(sql, (error, result) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ blogs: result });
    }
  })
});
// postリクエスト
app.post("/add", (req: Request, res: Response) => {
  console.log("postリクエストを受け付けました。");
  // console.log(req.body.data)
  const insertTime = GetDateTime();
  const { blog } = req.body.data;
  const id = "id1"
  const sql = `INSERT INTO blog (content, user_id, created_at) VALUES ("${blog}", "${id}", "${insertTime}")`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to add blog" });
    }
    res.status(200).json({ blogs: result });
  })
});
// deleteリクエスト
app.delete("/delete", (req: Request, res: Response) => {
  console.log("deleteリクエストを受け付けました。");
  console.log(req.body.id);
  const id = req.body.id;
  const sql = `DELETE FROM blog WHERE id="${id}"`;
  connection.query(sql, (error) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(200).json({ message: "success" });
    }
  })
})
// putリクエスト
app.put("/update", (req: Request, res: Response) => {
  console.log("putリクエストを受け付けました。");
  console.log(req.body.data);
  const { id, todo } = req.body.data;
  const sql = `UPDATE todo SET todo="${todo} WHERE id="${id}"`;
  connection.query(sql, (error) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ id, todo });
    }
  })
})

/* users */
// getリクエスト
app.get('/userlist', (req: Request, res: Response) => {
  console.log("userListリクエストを受け付けました。");
  const sql = "SELECT * FROM  users";
  connection.query(sql, (error, result) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ blogs: result });
    }
  })
});
// signup
app.post("/signup", (req: Request, res: Response) => {
  console.log("signupリクエストを受け付けました。");
  const insertTime = GetDateTime();
  const id = uid();
  const name = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO users (id, name, email, password, created_at) VALUES ("${id}", "${name}", "${email}", "${password}", "${insertTime}")`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "※登録失敗\nユーザーの登録に失敗しました。\n入力されたメールアドレスは既に使用されています。\n別のメールアドレスをご使用ください。" });
    }
    console.log(result)
    res.status(200).json({ id: id });
  })
});
// login
app.post("/login", (req: Request, res: Response) => {
  console.log("loginリクエストを受け付けました。");
  const email = req.body.email;
  const password = req.body.pwd;

  const sql = `SELECT * FROM users WHERE email="${email}" AND password="${password}"`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to registrate user" });
    }

    // @ts-ignore
    if (results.length === 0) {
      return res.status(500).json({ message: "※ログイン失敗\nログインに失敗しました。\n入力された情報が間違っています。\n再度ご入力いただくか、サインアップから始めてください。" });
    }
    // @ts-ignore
    const user_id = results[0].id;

    // token生成
    const token = jwt.sign({ email: email }, "SECRETKEY");
    const sqlToken = `INSERT INTO code (token, user_id) VALUES ("${token}", "${user_id}")`;

    connection.query(sqlToken, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to registrate user" });
      }
      res.status(200).json({ token: token });
    })
  })
});
// logout

// tokenCheck
app.post("/token", (req: Request, res: Response) => {
  console.log("tokenリクエストを受け付けました。");
  const successToken = req.body.successToken;

  const sqlToken = `SELECT user_id FROM code WHERE token="${successToken}"`;

  connection.query(sqlToken, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to registrate user" });
    }

    // @ts-ignore
    if (results.length === 0) {
      return res.status(500).json({ message: "※ログイン失敗\nログインに失敗しました。\n再度お試しください。" });
    }
    // @ts-ignore
    const user_id = results[0].user_id;
    console.log(user_id)
  
    // user取得 -------------------
    const sqlToken = `SELECT * FROM users WHERE id ="${user_id}"`;

    connection.query(sqlToken, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to registrate user" });
      }
      console.log(results)
      res.status(200).json({ result: results, passedToken:successToken });
    })
  })
});

try {
  app.listen(PORT, () => {
    console.log(`server running at://localhost:${PORT}`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}