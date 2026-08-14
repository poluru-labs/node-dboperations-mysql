import express, { type Request, type Response, type RequestHandler } from "express";
import DbOperations from "../../DbOperations";

const app = express();
const port = 3000;

app.use(express.json());

const db = new DbOperations({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_db",
});

const getUsers: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1) || 1;
    db.setPage(page);
    const users = await db.selectQuery("users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email } = req.body as { name?: string; email?: string };

    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required." });
      return;
    }

    const result = await db.insertQuery("users", { name, email });
    res.status(201).json({ message: "User created successfully.", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user." });
  }
};

app.get("/users", getUsers);
app.post("/users", createUser);

async function startServer() {
  try {
    await db.connect();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to start server:", message);
    process.exit(1);
  }
}

startServer();
