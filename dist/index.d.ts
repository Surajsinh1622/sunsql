import * as mysql from 'mysql2';
export declare let lQ: string;
export interface MySQLOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit?: number;
}
export declare const init: (options: MySQLOptions) => void;
export declare const setLastQuery: (query: string) => void;
export declare const connection: () => Promise<mysql.PoolConnection>;
/**
 * Executes a SQL query against the database and returns the results as a Promise.
 *
 * @param {string} query - The SQL query string to be executed.
 * @param {any[] | object} values - An array or object containing query parameter values.
 *
 * @returns {Promise<unknown>} A Promise that resolves with the query results or rejects with an error.
 */
export declare const query: (query: string, values?: any[] | object) => Promise<unknown>;
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
export declare const first: (tablesAndJoin: string, fields: string | string[], condition: object | null, additional?: string) => Promise<unknown>;
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
export declare const findAll: (tablesAndJoin: string, fields: string | string[], condition: object, additional?: string) => Promise<unknown>;
/**
 * @param {string} tablesAndJoin - String representing the tables and joins.
 * @param {string | string[]} fields - String or list of strings representing the fields to select.
 * @param {string} fieldToCount - String representing field to count.
 * @param {object} [where] - Optional string representing the WHERE clause conditions. (e.g., default {1 : 1})
 * @param {string} [additional] - Optional string containing additional SQL clauses (e.g., GROUP BY, ORDER BY, LIMIT).
 *
 * @returns {string} The prepared SQL query string.
 */
export declare const findAllWithCount: (tablesAndJoin: string, fields: string | string[], fieldToCount: string, condition: object, additional?: string) => Promise<{
    result: unknown[];
    count: number;
}>;
/**
 * Inserts data into the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
export declare function insert(table: string, data: Record<string, any>): Promise<mysql.ResultSetHeader | null>;
/**
 * Deletes rows from the specified table based on a condition.
 *
 * @param {string} table - Name of the table to delete from.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if deletion fails.
 */
export declare const deleteQuery: (table: string, condition: Record<string, any>) => Promise<mysql.ResultSetHeader | null>;
/**
 * Updates first data found.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
export declare const updateFirst: (table: string, data: Record<string, any>, condition: Record<string, any>) => Promise<mysql.ResultSetHeader | null>;
/**
 * Updates data in the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
export declare const update: (table: string, data: Record<string, any>, condition: Record<string, any>) => Promise<mysql.ResultSetHeader | null>;
/**
 * Inserts data in bulk into the specified table.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
export declare function insertMany(table: string, data: Record<string, any>[]): Promise<mysql.ResultSetHeader | null>;
/**
 * Deletes an entire table from the database.
 *
 * @param {string} table - Name of the table to delete.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if deletion fails.
 */
export declare const deleteTable: (table: string) => Promise<any>;
/**
 * Adds a new column to an existing table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} column - Name of the new column to add.
 * @param {string} dataType - Data type of the new column (e.g., VARCHAR(255), INT, DATETIME).
 *
 * @returns {Promise<Promise<any>>} A Promise that resolves with result or null if column addition fails.
 */
export declare const addColumn: (table: string, column: string, dataType: string) => Promise<Promise<any>>;
/**
 * Renames an existing column in a table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} oldColumnName - Name of the column to rename.
 * @param {string} newColumnName - New name for the column.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if column renaming fails.
 */
export declare const renameColumn: (table: string, oldColumnName: string, newColumnName: string) => Promise<any>;
