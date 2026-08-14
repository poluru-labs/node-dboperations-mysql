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

    db.setPage(1);
    db.setResultsPerPage(10);
    db.setOrderBy("id DESC");

    const rows = await db.selectQuery("users");
    console.log("Page 1 users:", rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Pagination example failed:", message);
  } finally {
    await db.close();
  }
}

run();
