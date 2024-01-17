import * as sSql from './index';

const dbOptions: sSql.MySQLOptions = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
};

sSql.init(dbOptions);

sSql.first('users', ['id', 'first_name', 'email'], { id: 1008 } , 'ORDER BY first_name')
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log(`first : ${sSql.lQ}`);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.insert('users', {
    first_name: 'John 4',
    last_name: 'sina',
    gender: 'Male',
    email: 'JoneSina@gmail.com',
    ip_address: '99.98.123.56',
})
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.insertMany('users', [
    {
        first_name: 'min 7',
        last_name: 'sina',
        gender: 'Male',
        email: 'MinSina7@gmail.com',
        ip_address: '99.98.123.56',
    },
    {
        first_name: 'min 8',
        last_name: 'sina',
        gender: 'Male',
        email: 'MinSina8@gmail.com',
        ip_address: '99.98.123.56',
    },
])
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log(sSql.lQ);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.updateFirst('users', { first_name: 'min 1' }, { id: 1008 })
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log(`updateFirst : ${sSql.lQ}`);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.deleteQuery('users', {
    first_name: 'John 4',
})
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.update('users', {
    first_name: 'John 4',
},{first_name: 'John 3'})
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.findAll('users', ['id', 'first_name', 'email'], { 1: 1 }, 'limit 25')
    .then((results) => {
        console.log('====================================');
        console.log(results);
        console.log(sSql.lQ);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });

sSql.findAllWithCount('users', ['first_name', 'email'], 'id', {
    gender: 'Male',
})
    .then((results: any) => {
        console.log('====================================');
        console.log(results);
        console.log('====================================');
    })
    .catch((error) => {
        console.error('Error fetching results:', error);
    });
