import DbOperations from "../../DbOperations";

const db = new DbOperations({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_db",
});

async function run() {
  try {
    await db.connect();

    const rows = await db.query<{ id: number; name: string; email: string }[]>(
      "SELECT id, name, email FROM users WHERE name LIKE ? ORDER BY id DESC",
      ["%Poluru%"]
    );

    const totals = await db.query<{ total: number }[]>("SELECT COUNT(*) AS total FROM users");

    console.log("Matching users:", rows);
    console.log("Total users:", totals[0]?.total);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Raw query example failed:", message);
  } finally {
    await db.close();
  }
}

run();
