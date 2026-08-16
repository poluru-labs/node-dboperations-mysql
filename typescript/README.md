# TypeScript MySQL DB Operations

This folder contains the TypeScript version of the same CRUD and pagination logic found in the JavaScript package.

## Features

- Connect and close MySQL connections
- Insert, select, update, and delete records
- Query builder with conditional filters
- Pagination support
- Optional ordering support
- Type-safe configuration and data models
- Import/export based module structure

## Installation

```bash
cd typescript
npm install
```

## Build

```bash
npm run build
```

## Quick usage

```ts
import DbOperations from "./DbOperations";

const db = new DbOperations({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_db",
});

await db.connect();
const users = await db.selectQuery("users");
console.log(users);
await db.close();
```

## Examples

The examples directory includes a few common workflows you can adapt quickly:

- `basic-crud.ts` — insert, read, update, and delete a user
- `conditional-filtering.ts` — query by multiple conditions and date-based filters
- `pagination-and-ordering.ts` — page through rows and sort results
- `raw-query.ts` — run custom SQL and aggregate results
- `bulk-insert.ts` — insert multiple records in sequence
- `transaction.ts` — wrap related database changes in a transaction
- `express-example.ts` — expose the database layer through an Express API
