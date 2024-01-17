"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameColumn = exports.addColumn = exports.deleteTable = exports.insertMany = exports.update = exports.updateFirst = exports.deleteQuery = exports.insert = exports.findAllWithCount = exports.findAll = exports.first = exports.query = exports.connection = exports.setLastQuery = exports.init = exports.lQ = void 0;
const mysql = __importStar(require("mysql2"));
let pool;
const init = function (options) {
    try {
        pool = mysql.createPool({
            ...options,
            connectionLimit: options.connectionLimit || 5,
        });
    }
    catch (error) {
        throw new Error('Failed to initialize MySQL connection: ' + error.message);
    }
};
exports.init = init;
const setLastQuery = function (query) {
    exports.lQ = query || '';
};
exports.setLastQuery = setLastQuery;
const connection = function () {
    return new Promise((resolve, reject) => {
        if (!pool) {
            return reject(new Error('Unexpected Error, Please check your database connection settings and make sure you have init MySQL'));
        }
        pool.getConnection((err, connection) => {
            return err ? reject(err) : resolve(connection);
        });
    });
};
exports.connection = connection;
function prepareQuery(tablesAndJoin, fields, where = '1=1', additional) {
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
function prepareQueryWithCount(tablesAndJoin, fields, fieldToCount = '*', where = '1=1', additional) {
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
const query = function (query, values = []) {
    return new Promise((resolve, reject) => {
        (0, exports.connection)()
            .then((connection) => {
            connection.query(query, values, (err, results) => {
                connection.release();
                return err ? reject(err) : resolve(results);
            });
            (0, exports.setLastQuery)(connection.format(query, values));
        })
            .catch(reject);
    });
};
exports.query = query;
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
const first = async function (tablesAndJoin, fields, condition, additional) {
    let where = '1=1';
    let values = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQuery(tablesAndJoin, fields, where, additional);
    const data = await (0, exports.query)(q + ' LIMIT 1', values);
    return Array.isArray(data) ? data[0] : data;
};
exports.first = first;
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
const findAll = function (tablesAndJoin, fields, condition, additional) {
    let where = '1=1';
    let values = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQuery(tablesAndJoin, fields, where, additional);
    return (0, exports.query)(q, values);
};
exports.findAll = findAll;
/**
 * @param {string} tablesAndJoin - String representing the tables and joins.
 * @param {string | string[]} fields - String or list of strings representing the fields to select.
 * @param {string} fieldToCount - String representing field to count.
 * @param {object} [where] - Optional string representing the WHERE clause conditions. (e.g., default {1 : 1})
 * @param {string} [additional] - Optional string containing additional SQL clauses (e.g., GROUP BY, ORDER BY, LIMIT).
 *
 * @returns {string} The prepared SQL query string.
 */
const findAllWithCount = function (tablesAndJoin, fields, fieldToCount, condition, additional) {
    let where = '1=1';
    let values = [];
    if (condition) {
        values = Object.values(condition);
        const conditionKeys = Object.keys(condition);
        where = conditionKeys.map((name) => `${name} = ?`).join(' AND ');
    }
    const q = prepareQueryWithCount(tablesAndJoin, fields, fieldToCount, where, additional);
    return (0, exports.query)(q, values).then((data) => {
        const count = data[0][fieldToCount + '_count'];
        data.forEach((row) => {
            delete row[fieldToCount + '_count'];
        });
        return { result: data, count };
    });
};
exports.findAllWithCount = findAllWithCount;
/**
 * Inserts data into the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
async function insert(table, data) {
    try {
        const columnNames = Object.keys(data);
        const placeholders = columnNames.map((name) => `?`).join(', ');
        const values = Object.values(data);
        const q = `INSERT INTO ${mysql.escapeId(table)} (${columnNames.join(', ')}) VALUES (${placeholders})`;
        const result = await (0, exports.query)(q, values);
        return result;
    }
    catch (error) {
        // Log error details
        console.error(`Error inserting data into ${table}:`, error);
        return null; // Indicate failure
    }
}
exports.insert = insert;
/**
 * Deletes rows from the specified table based on a condition.
 *
 * @param {string} table - Name of the table to delete from.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if deletion fails.
 */
const deleteQuery = async (table, condition) => {
    try {
        const values = Object.values(condition);
        const columnNames = Object.keys(condition);
        const placeholders = columnNames
            .map((name) => `${name} = ?`)
            .join(' AND ');
        const q = `DELETE FROM ${mysql.escapeId(table)} WHERE ${placeholders}`;
        const result = await (0, exports.query)(q, values);
        return result;
    }
    catch (error) {
        // Log error details
        console.error(`Error deleting data from ${table}:`, error);
        return null; // Indicate failure
    }
};
exports.deleteQuery = deleteQuery;
/**
 * Updates first data found.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
const updateFirst = async (table, data, condition) => {
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
        const q = `UPDATE ${mysql.escapeId(table)} SET ${dataPlaceholders} WHERE ${conditionPlaceholders} LIMIT 1`;
        const result = await (0, exports.query)(q, values);
        return result.affectedRows;
    }
    catch (error) {
        // Log error details
        console.error(`Error updating data in ${table}:`, error);
        return null; // Indicate failure
    }
};
exports.updateFirst = updateFirst;
/**
 * Updates data in the specified table, handling potential errors and logging results.
 *
 * @param {string} table - Name of the table to update.
 * @param {Record<string, any>} data - Object containing the data to update, where keys represent column names and values represent new data.
 * @param {Record<string, any>} condition - An object containing key-value pairs for where (e.g. {id : 10}).
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if update fails.
 */
const update = async (table, data, condition) => {
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
        const q = `UPDATE ${mysql.escapeId(table)} SET ${dataPlaceholders} WHERE ${conditionPlaceholders}`;
        const result = await (0, exports.query)(q, values);
        return result;
    }
    catch (error) {
        // Log error details
        console.error(`Error updating data in ${table}:`, error);
        return null; // Indicate failure
    }
};
exports.update = update;
/**
 * Inserts data in bulk into the specified table.
 *
 * @param {string} table - Name of the table to insert into.
 * @param {Record<string, any>} data - Object containing the data to insert, where keys represent column names and values represent data to insert.
 *
 * @returns {Promise<mysql.ResultSetHeader | null>} A Promise that resolves with result or null if insertion fails.
 */
async function insertMany(table, data) {
    try {
        const columnNames = Object.keys(data[0]);
        const placeholders = Array(data.length)
            .fill(undefined) // Fill with undefined to create empty placeholder groups
            .map(() => `(${columnNames.map((name) => `?`).join(', ')})`)
            .join(', ');
        const values = data.flatMap((row) => Object.values(row));
        const q = `INSERT INTO ${mysql.escapeId(table)} (${columnNames.join(', ')}) VALUES ${placeholders}`;
        const result = await (0, exports.query)(q, values);
        return result;
    }
    catch (error) {
        console.error(`Error inserting multiple rows into ${table}:`, error);
        return null;
    }
}
exports.insertMany = insertMany;
/**
 * Deletes an entire table from the database.
 *
 * @param {string} table - Name of the table to delete.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if deletion fails.
 */
const deleteTable = async (table) => {
    try {
        const q = `DROP TABLE ${mysql.escapeId(table)}`;
        const result = await (0, exports.query)(q);
        return result;
    }
    catch (error) {
        console.error(`Error deleting table ${table}:`, error);
        return null;
    }
};
exports.deleteTable = deleteTable;
/**
 * Adds a new column to an existing table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} column - Name of the new column to add.
 * @param {string} dataType - Data type of the new column (e.g., VARCHAR(255), INT, DATETIME).
 *
 * @returns {Promise<Promise<any>>} A Promise that resolves with result or null if column addition fails.
 */
const addColumn = async (table, column, dataType) => {
    try {
        const q = `ALTER TABLE ${mysql.escapeId(table)} ADD ${mysql.escapeId(column)} ${dataType}`;
        const result = await (0, exports.query)(q);
        return result;
    }
    catch (error) {
        console.error(`Error adding column ${column} to table ${table}:`, error);
        return null;
    }
};
exports.addColumn = addColumn;
/**
 * Renames an existing column in a table.
 *
 * @param {string} table - Name of the table to modify.
 * @param {string} oldColumnName - Name of the column to rename.
 * @param {string} newColumnName - New name for the column.
 *
 * @returns {Promise<any>} A Promise that resolves with result or null if column renaming fails.
 */
const renameColumn = async (table, oldColumnName, newColumnName) => {
    try {
        const q = `ALTER TABLE ${mysql.escapeId(table)} RENAME COLUMN ${mysql.escapeId(oldColumnName)} TO ${mysql.escapeId(newColumnName)}`;
        // Specify the return type of query as ResultSetHeader | null
        const result = await (0, exports.query)(q);
        return result;
    }
    catch (error) {
        console.error(`Error renaming column ${oldColumnName} in table ${table}:`, error);
        return null;
    }
};
exports.renameColumn = renameColumn;
