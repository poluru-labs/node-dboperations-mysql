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

    const insertResult = await db.insertQuery("users", {
      name: "Subrahmanyam Poluru",
      email: "subrahmanyam.poluru@example.com",
    });
    console.log("Inserted:", insertResult);

    const users = await db.selectQuery("users", {
      name: "Subrahmanyam Poluru",
    });
    console.log("Users:", users);

    const updated = await db.updateQuery(
      "users",
      { email: "updated.poluru@example.com" },
      { name: "Subrahmanyam Poluru" }
    );
    console.log("Updated:", updated);

    const deleted = await db.deleteQuery("users", {
      name: "Subrahmanyam Poluru",
    });
    console.log("Deleted:", deleted);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("CRUD example failed:", message);
  } finally {
    await db.close();
  }
}

run();
