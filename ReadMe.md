## Initializing the Connection

Before using any query functions, you must initialize the connection to your database:

```JavaScript
import * as sSql from './index';

const dbOptions: sSql.MySQLOptions = {
    host: 'your_database_host',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name',
};

sSql.init(dbOptions);
```

## Using the Query Functions

### Retrieving Data

-   first(tablesAndJoin, fields, condition, additional?):
    -   Retrieves the first matching row from the database.
    -   Example:

```JavaScript
const firstUser = await sSql.first('users', ['id', 'first_name', 'email'], { id: 1008 }, 'ORDER BY first_name');
console.log(firstUser);
```

-   findAll(tablesAndJoin, fields, condition, additional?):
    -   Retrieves multiple matching rows.
    -   Example:

```JavaScript
const users = await sSql.findAll('users', ['id', 'first_name', 'email'], { 1: 1 }, 'limit 25');
console.log(users);
```

-   findAllWithCount(tablesAndJoin, fields, fieldToCount, condition, additional?):
    -   Retrieves rows and counts the specified field.
    -   Example:

```JavaScript
const userResults = await sSql.findAllWithCount('users', ['first_name', 'email'], 'id', { gender: 'Male' });
console.log(userResults);
```

### Inserting Data

-   insert(table, data):
    -   Inserts a single row into the table.
    -   Example:

```JavaScript
const insertResult = await sSql.insert('users', { first_name: 'John 4', last_name: 'sina', gender: 'Male', email: 'JoneSina@gmail.com', ip_address: '99.98.123.56' });
console.log(insertResult);
```

-   insertMany(table, data):
    -   Inserts multiple rows into the table.
    -   Example:

```JavaScript
const insertManyResult = await sSql.insertMany('users', [
    { first_name: 'min 7', last_name: 'sina', gender: 'Male', email: 'MinSina7@gmail.com', ip_address: '99.98.123.56' },
    { first_name: 'min 8', last_name: 'sina', gender: 'Male', email: 'MinSina8@gmail.com', ip_address: '99.98.123.56' },
]);
console.log(insertManyResult);
```

### Updating Data

-   update(table, data, condition):
    -   Updates matching rows in the table.
    -   Example:

```JavaScript
const updateResult = await sSql.update('users', { first_name: 'John 3' }, { first_name: 'John 4' });
console.log(updateResult);
```

-   updateFirst(table, data, condition):
    -   Updates only the first matching row.
    -   Example:

```JavaScript
const updateFirstResult = await sSql.updateFirst('users', { first_name: 'min 1' }, { id: 1008 });
console.log(updateFirstResult);
```

### Deleting Data

-   deleteQuery(table, condition):
    -   Deletes matching rows from the table.
    -   Example:

```JavaScript
const deleteResult = await sSql.deleteQuery('users', { first : "min 1"})
console.log(deleteResult);
```
