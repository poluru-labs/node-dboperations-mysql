import mysql, { type Connection, type ConnectionOptions, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

export type PrimitiveValue = string | number | boolean | null | undefined;
export type QueryRecord = Record<string, PrimitiveValue>;

export type WhereClause = {
  sql: string;
  params: PrimitiveValue[];
};

export class DbOperations {
  public config: ConnectionOptions;
  public resultsPerPage = 5;
  public page = 1;
  public orderBy = "";
  public message = "";

  private connection: Connection | null = null;

  constructor(config: ConnectionOptions) {
    this.config = config;
  }

  async connect(): Promise<Connection> {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log("Connected to the database.");
      return this.connection;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown database connection error";
      console.error("Database connection failed:", message);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (!this.connection) {
      return;
    }

    await this.connection.end();
    this.connection = null;
    console.log("Database connection closed.");
  }

  async query<T = RowDataPacket[] | ResultSetHeader>(sql: string, params: any[] = []): Promise<T> {
    if (!this.connection) {
      throw new Error("Database connection is not established.");
    }

    try {
      const [rows] = await this.connection.execute(sql, params as any);
      return rows as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown query execution error";
      console.error("Query execution failed:", message);
      throw error;
    }
  }

  async selectQuery<T = Record<string, unknown>[]>(table: string, conditions: QueryRecord | null = null): Promise<T> {
    const { sql: conditionSql, params: conditionParams } = this.getCondition(conditions);
    const limitSql = this.resultsPerPage ? `LIMIT ${(this.page - 1) * this.resultsPerPage}, ${this.resultsPerPage}` : "";
    const orderSql = this.orderBy ? this.orderBy : "";
    const sql = `SELECT * FROM ${table} ${conditionSql} ${orderSql} ${limitSql}`.trim();

    return this.query<T>(sql, conditionParams);
  }

  async insertQuery<T = ResultSetHeader>(table: string, data: QueryRecord): Promise<T> {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(data);
    const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

    return this.query<T>(sql, values);
  }

  async updateQuery<T = ResultSetHeader>(table: string, data: QueryRecord, conditions: QueryRecord | null = null): Promise<T> {
    if (Object.keys(data).length === 0) {
      throw new Error("Update data cannot be empty.");
    }

    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const { sql: conditionSql, params: conditionParams } = this.getCondition(conditions);
    const sql = `UPDATE ${table} SET ${setClause} ${conditionSql}`.trim();
    const values = [...Object.values(data), ...conditionParams];

    return this.query<T>(sql, values);
  }

  async deleteQuery<T = ResultSetHeader>(table: string, conditions: QueryRecord | null = null): Promise<T> {
    const { sql: conditionSql, params: conditionParams } = this.getCondition(conditions);
    const sql = `DELETE FROM ${table} ${conditionSql}`.trim();

    return this.query<T>(sql, conditionParams);
  }

  getCondition(conditions: QueryRecord | null = null): WhereClause {
    if (!conditions || Object.keys(conditions).length === 0) {
      return { sql: "", params: [] };
    }

    const conditionString = Object.keys(conditions)
      .map((key) => `${key} = ?`)
      .join(" AND ");

    const params = Object.values(conditions).filter((value) => value !== undefined) as PrimitiveValue[];

    return { sql: `WHERE ${conditionString}`, params };
  }

  setPage(page: number): void {
    this.page = Number(page) || 1;
  }

  setOrderBy(orderBy: string): void {
    this.orderBy = orderBy ? `ORDER BY ${orderBy}` : "";
  }

  setResultsPerPage(size: number): void {
    this.resultsPerPage = Number(size) > 0 ? Number(size) : 5;
  }

  setMessage(message = ""): void {
    this.message = message;
  }

  redirect(url: string): void {
    console.log(`Redirecting to: ${url}`);
  }
}

export const createDbOperations = (config: ConnectionOptions): DbOperations => new DbOperations(config);

export default DbOperations;
