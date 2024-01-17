import * as mysql from 'mysql2';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';

let pool: Pool;
export let lQ: string;

export interface MySQLOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit?: number;
    // Add other properties as needed
}

export const init = function (options: MySQLOptions): void {
    try {
        pool = mysql.createPool({
            ...options,
            connectionLimit: options.connectionLimit || 5,
        });
    } catch (error: any) {
        throw new Error(
            'Failed to initialize MySQL connection: ' + error.message
        );
    }
};

export const setLastQuery = function (query: string): void {
    lQ = query || '';
};

export const connection = function (): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
        if (!pool) {
            return reject(
                new Error(
                    'Unexpected Error, Please check your database connection settings and make sure you have init MySQL'
                )
            );
        }

        pool.getConnection((err, connection) => {
            return err ? reject(err) : resolve(connection);
        });
    });
};

function prepareQuery(
    tablesAndJoin: string,
    fields: string | string[],
    where = '1=1',
    additional?: string
): string {
    const fList = Array.isArray(fields) ? fields.join(', ') : fields;

    let query = `
      SELECT ${fList}
      FROM ${tablesAndJoin}
      WHERE ${where}
    `;

    if (additional) {
        query += `\n${additional}`;
    }

    return query;
}

function prepareQueryWithCount(
    tablesAndJoin: string,
    fields: string | string[],
    fieldToCount: string = '*',
    where = '1=1',
    additional?: string
): string {
    const fList = Array.isArray(fields) ? fields.join(', ') : fields;

    let query = `
      SELECT ${fList} , count(${fieldToCount}) over() AS ${fieldToCount}_count 
      FROM ${tablesAndJoin}
      WHERE ${where}
    `;

    if (additional) {
        query += `\n${additional}`;
    }

    return query;
}

/**
 * Executes a SQL query against the database and returns the results as a Promise.
 *
 * @param {string} query - The SQL query string to be executed.
 * @param {any[] | object} values - An array or object containing query parameter values.
 *
 * @returns {Promise<unknown>} A Promise that resolves with the query results or rejects with an error.
 */
export const query = function (
    query: string,
    values: any[] | object = []
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        connection()
            .then((connection) => {
                connection.query(
                    query,
                    values,
                    (err: any, results: unknown) => {
                        connection.release();
                        return err ? reject(err) : resolve(results);
                    }
                );
                setLastQuery(connection.format(query, values));
            })
            .catch(reject);
    });
};

/**
 * Retrieves a single data item from the database based on the provided criteria.
 *
 * @param {string} tablesAndJoin - String representing the tables and joins to query.
 * @param {string | string[]} fields - String or list of strings representing the fields to select.
 * @param {object} [where] - Optional string representing the WHERE clause conditions. (e.g., default {1 : 1})
 * @param {string} [additional] - Optional string containing additional SQL clauses (e.g., GROUP BY, ORDER BY). A LIMIT 1 clause is automatically added.
 *
 * @returns {Promise<unknown>} A Promise that resolves with the first retrieved data item, or null if no data is found.
 */
export const first = async function (
    tablesAndJoin: string,
    fields: string | string[],
    condition: object | null,
    additional?: string
): Promise<unknown> {
    let where = '1=1';
    let values: any[] = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQuery(tablesAndJoin, fields, where, additional);
    const data = await query(q + ' LIMIT 1', values);
    return Array.isArray(data) ? data[0] : data;
};

/**
 * Prepares a SQL query string based on provided parameters.
 *
 * @param {string} tablesAndJoin - String representing the tables and joins.
 * @param {string | string[]} fields - String or list of strings representing the fields to select.
 * @param {object} [where] - Optional string representing the WHERE clause conditions. (e.g., default {1 : 1})
 * @param {string} [additional] - Optional string containing additional SQL clauses (e.g., GROUP BY, ORDER BY, LIMIT).
 *
 * @returns {string} The prepared SQL query string.
 */
export const findAll = function (
    tablesAndJoin: string,
    fields: string | string[],
    condition: object,
    additional?: string
): Promise<unknown> {
    let where = '1=1';
    let values: any[] = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQuery(tablesAndJoin, fields, where, additional);
    return query(q, values);
};

/**
 * @param {string} tablesAndJoin - String representing the tables and joins.
 * @param {string | string[]} fields - String or list of strings representing the fields to select.
 * @param {string} fieldToCount - String representing field to count.
 * @param {object} [where] - Optional string representing the WHERE clause conditions. (e.g., default {1 : 1})
 * @param {string} [additional] - Optional string containing additional SQL clauses (e.g., GROUP BY, ORDER BY, LIMIT).
 *
 * @returns {string} The prepared SQL query string.
 */
export const findAllWithCount = function (
    tablesAndJoin: string,
    fields: string | string[],
    fieldToCount: string,
    condition: object,
    additional?: string
): Promise<{ result: unknown[]; count: number }> {
    let where = '1=1';
    let values: any[] = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQueryWithCount(
        tablesAndJoin,
        fields,
        fieldToCount,
        where,
        additional
    );

    return query(q, values).then((data: any) => {
        const count = data[0][fieldToCount + '_count'];
        data.forEach((row: any) => {
            delete row[fieldToCount + '_count'];
        });
        return { result: data, count };
    });
};

/**
 * Inserts data into the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
export async function insert(
    table: string,
    data: Record<string, any>
): Promise<mysql.ResultSetHeader | null> {
    try {
        const columnNames = Object.keys(data);
        const placeholders = columnNames.map((name) => `?`).join(', ');
        const values = Object.values(data);

        const q = `INSERT INTO ${mysql.escapeId(table)} (${columnNames.join(
            ', '
        )}) VALUES (${placeholders})`;

        const result: any = await query(q, values);
        return result;
    } catch (error) {
        // Log error details
        console.error(`Error inserting data into ${table}:`, error);
        return null; // Indicate failure
    }
}

/**
 * Deletes rows from the specified table based on a condition.
 *
 * @param {string} table - Name of the table to delete from.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if deletion fails.
 */
export const deleteQuery = async (
    table: string,
    condition: Record<string, any>
): Promise<mysql.ResultSetHeader | null> => {
    try {
        const values: any[] = Object.values(condition);

        const columnNames = Object.keys(condition);
        const placeholders = columnNames
            .map((name) => `${name} = ?`)
            .join(' AND ');
        const q = `DELETE FROM ${mysql.escapeId(table)} WHERE ${placeholders}`;

        const result: any = await query(q, values);
        return result;
    } catch (error) {
        // Log error details
        console.error(`Error deleting data from ${table}:`, error);
        return null; // Indicate failure
    }
};

/**
 * Updates first data found.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
export const updateFirst = async (
    table: string,
    data: Record<string, any>,
    condition: Record<string, any>
): Promise<mysql.ResultSetHeader | null> => {
    try {
        const values = [...Object.values(data), ...Object.values(condition)];

        // Handle data placeholders
        const columnNames = Object.keys(data);
        const dataPlaceholders = columnNames
            .map((name) => `${name} = ?`)
            .join(', ');

        // Handle condition
        const conditionKeys = Object.keys(condition);
        const conditionPlaceholders = conditionKeys
            .map((name) => `${name} = ?`)
            .join(' AND ');
        const q = `UPDATE ${mysql.escapeId(
            table
        )} SET ${dataPlaceholders} WHERE ${conditionPlaceholders} LIMIT 1`;

        const result: any = await query(q, values);
        return result.affectedRows;
    } catch (error) {
        // Log error details
        console.error(`Error updating data in ${table}:`, error);
        return null; // Indicate failure
    }
};

/**
 * Updates data in the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
export const update = async (
    table: string,
    data: Record<string, any>,
    condition: Record<string, any>
): Promise<mysql.ResultSetHeader | null> => {
    try {
        const values = [...Object.values(data), ...Object.values(condition)];

        // Handle data placeholders
        const columnNames = Object.keys(data);
        const dataPlaceholders = columnNames
            .map((name) => `${name} = ?`)
            .join(', ');

        // Handle condition
        const conditionKeys = Object.keys(condition);
        const conditionPlaceholders = conditionKeys
            .map((name) => `${name} = ?`)
            .join(' AND ');
        const q = `UPDATE ${mysql.escapeId(
            table
        )} SET ${dataPlaceholders} WHERE ${conditionPlaceholders}`;

        const result: any = await query(q, values);
        return result;
    } catch (error) {
        // Log error details
        console.error(`Error updating data in ${table}:`, error);
        return null; // Indicate failure
    }
};

/**
 * Inserts data in bulk into the specified table.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
export async function insertMany(
    table: string,
    data: Record<string, any>[]
): Promise<mysql.ResultSetHeader | null> {
    try {
        const columnNames = Object.keys(data[0]);
        const placeholders = Array(data.length)
            .fill(undefined) // Fill with undefined to create empty placeholder groups
            .map(() => `(${columnNames.map((name) => `?`).join(', ')})`)
            .join(', ');
        const values = data.flatMap((row) => Object.values(row));

        const q = `INSERT INTO ${mysql.escapeId(table)} (${columnNames.join(
            ', '
        )}) VALUES ${placeholders}`;
        const result: any = await query(q, values);
        return result;
    } catch (error) {
        console.error(`Error inserting multiple rows into ${table}:`, error);
        return null;
    }
}

/**
 * Deletes an entire table from the database.
 *
 * @param {string} table - Name of the table to delete.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if deletion fails.
 */
export const deleteTable = async (table: string): Promise<any> => {
    try {
        const q = `DROP TABLE ${mysql.escapeId(table)}`;
        const result = await query(q);
        return result;
    } catch (error) {
        console.error(`Error deleting table ${table}:`, error);
        return null;
    }
};

/**
 * Adds a new column to an existing table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} column - Name of the new column to add.
 * @param {string} dataType - Data type of the new column (e.g., VARCHAR(255), INT, DATETIME).
 *
 * @returns {Promise<Promise<any>>} A Promise that resolves with result or null if column addition fails.
 */
export const addColumn = async (
    table: string,
    column: string,
    dataType: string
): Promise<Promise<any>> => {
    try {
        const q = `ALTER TABLE ${mysql.escapeId(table)} ADD ${mysql.escapeId(
            column
        )} ${dataType}`;
        const result = await query(q);
        return result;
    } catch (error) {
        console.error(
            `Error adding column ${column} to table ${table}:`,
            error
        );
        return null;
    }
};

/**
 * Renames an existing column in a table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} oldColumnName - Name of the column to rename.
 * @param {string} newColumnName - New name for the column.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if column renaming fails.
 */
export const renameColumn = async (
    table: string,
    oldColumnName: string,
    newColumnName: string
): Promise<any> => {
    try {
        const q = `ALTER TABLE ${mysql.escapeId(
            table
        )} RENAME COLUMN ${mysql.escapeId(oldColumnName)} TO ${mysql.escapeId(
            newColumnName
        )}`;
        // Specify the return type of query as ResultSetHeader | null
        const result = await query(q);
        return result;
    } catch (error) {
        console.error(
            `Error renaming column ${oldColumnName} in table ${table}:`,
            error
        );
        return null;
    }
};
