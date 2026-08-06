# node-mysql-dboperations

Node MySQL DB Operations — CRUD (Create, Read, Update, Delete), Pagination, and Error Handling.

This module provides a structured way to interact with a MySQL database using the [mysql2/promise](https://www.npmjs.com/package/mysql2) library for asynchronous operations. It includes methods for performing CRUD operations, dynamically building queries with conditional filters, and supporting pagination. Error handling ensures issues during database interactions are logged.

## Author

**Subrahmanyam Poluru**

- Email: [subrahmanyam.poluru@gmail.com](mailto:subrahmanyam.poluru@gmail.com)
- GitHub: [polurus-works](https://github.com/polurus-works)

## Installation

```bash
npm install mysql2
```

Then require the module from this package:

```js
const DbOperations = require('./lib/DbOperations');
```

## Quick start

```js
const DbOperations = require('./lib/DbOperations');

(async () => {
  const db = new DbOperations({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test_db',
  });

  try {
    await db.connect();

    await db.insertQuery('users', {
      name: 'Subrahmanyam Poluru',
      email: 'subrahmanyam.poluru@example.com',
    });

    const users = await db.selectQuery('users', {
      name: 'Subrahmanyam Poluru',
    });
    console.log(users);

    await db.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

## API overview

| Method | Description |
| --- | --- |
| `connect()` | Open a MySQL connection |
| `close()` | Close the connection |
| `insertQuery(table, data)` | Insert a row |
| `selectQuery(table, conditions?)` | Select rows (supports pagination) |
| `updateQuery(table, data, conditions)` | Update rows matching conditions |
| `deleteQuery(table, conditions)` | Delete rows matching conditions |
| `query(sql, params?)` | Run a raw SQL statement |
| `setPage(page)` | Set the current page for pagination (default: `1`) |
| `setMessage(message)` | Store a status message |
| `redirect(url)` | Log a redirect URL (Node-friendly helper) |

Default page size is **5** rows (`resultsPerPage`).

## Examples

### 1. Full CRUD

```js
const DbOperations = require('./lib/DbOperations');

(async () => {
  const db = new DbOperations({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test_db',
  });

  try {
    await db.connect();

    // Create
    await db.insertQuery('users', {
      name: 'Subrahmanyam Poluru',
      email: 'subrahmanyam.poluru@example.com',
    });
    console.log('Data inserted successfully.');

    // Read
    const users = await db.selectQuery('users', {
      name: 'Subrahmanyam Poluru',
    });
    console.log('Selected Users:', users);

    // Update
    await db.updateQuery(
      'users',
      { email: 'subrahmanyamp@example.com' },
      { name: 'Subrahmanyam Poluru' }
    );
    console.log('Data updated successfully.');

    // Delete
    await db.deleteQuery('users', { name: 'Subrahmanyam Poluru' });
    console.log('Data deleted successfully.');

    await db.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

### 2. Select all rows (with pagination)

```js
const db = new DbOperations(dbConfig);
await db.connect();

// Page 1 (default) — up to 5 rows
const page1 = await db.selectQuery('users');
console.log('Page 1:', page1);

// Page 2
db.setPage(2);
const page2 = await db.selectQuery('users');
console.log('Page 2:', page2);

await db.close();
```

### 3. Filter by conditions

```js
await db.connect();

// Single condition
const byEmail = await db.selectQuery('users', {
  email: 'subrahmanyam.poluru@example.com',
});

// Multiple conditions (AND)
const byNameAndEmail = await db.selectQuery('users', {
  name: 'Subrahmanyam Poluru',
  email: 'subrahmanyam.poluru@example.com',
});

console.log(byEmail, byNameAndEmail);
await db.close();
```

### 4. Raw SQL with `query()`

```js
await db.connect();

const rows = await db.query(
  'SELECT id, name, email FROM users WHERE name LIKE ? ORDER BY id DESC',
  ['%Poluru%']
);
console.log(rows);

const [{ total }] = await db.query('SELECT COUNT(*) AS total FROM users');
console.log('Total users:', total);

await db.close();
```

### 5. Custom page size

```js
const db = new DbOperations(dbConfig);
db.resultsPerPage = 10; // show 10 rows per page
db.setPage(1);

await db.connect();
const users = await db.selectQuery('users');
console.log(users);
await db.close();
```

### 6. Express REST API

See [`example-with-express.js`](./example-with-express.js) for a full server. Minimal sketch:

```js
const express = require('express');
const DbOperations = require('./lib/DbOperations');

const app = express();
app.use(express.json());

const db = new DbOperations({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_db',
});

(async () => {
  await db.connect();
})();

app.get('/users', async (req, res) => {
  try {
    db.setPage(parseInt(req.query.page, 10) || 1);
    const users = await db.selectQuery('users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.insertQuery('users', { name, email });
    res.status(201).json({ message: 'User created successfully.', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 7. Error handling pattern

```js
const db = new DbOperations(dbConfig);

try {
  await db.connect();
  await db.insertQuery('users', { name: 'Ada Lovelace', email: 'ada@example.com' });
} catch (error) {
  db.setMessage(error.message);
  console.error('Operation failed:', db.message);
} finally {
  await db.close();
}
```

## Sample files

| File | Description |
| --- | --- |
| [`example.js`](./example.js) | Standalone CRUD script |
| [`example-with-express.js`](./example-with-express.js) | Express routes for users |

## License

MIT © Subrahmanyam Poluru
