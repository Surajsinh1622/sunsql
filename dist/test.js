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
const sSql = __importStar(require("./index"));
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
};
sSql.init(dbOptions);
// sSql.first('users', ['id', 'first_name', 'email'], { id: 1008 } , 'ORDER BY first_name')
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log(`first : ${sSql.lQ}`);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.insert('users', {
//     first_name: 'John 4',
//     last_name: 'sina',
//     gender: 'Male',
//     email: 'JoneSina@gmail.com',
//     ip_address: '99.98.123.56',
// })
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.insertMany('users', [
//     {
//         first_name: 'min 7',
//         last_name: 'sina',
//         gender: 'Male',
//         email: 'MinSina7@gmail.com',
//         ip_address: '99.98.123.56',
//     },
//     {
//         first_name: 'min 8',
//         last_name: 'sina',
//         gender: 'Male',
//         email: 'MinSina8@gmail.com',
//         ip_address: '99.98.123.56',
//     },
// ])
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log(sSql.lQ);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.updateFirst('users', { first_name: 'min 1' }, { id: 1008 })
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log(`updateFirst : ${sSql.lQ}`);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.deleteQuery('users', {
//     first_name: 'John 4',
// })
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.update('users', {
//     first_name: 'John 4',
// },{first_name: 'John 3'})
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
// sSql.findAll('users', ['id', 'first_name', 'email'], { 1: 1 }, 'limit 25')
//     .then((results) => {
//         console.log('====================================');
//         console.log(results);
//         console.log(sSql.lQ);
//         console.log('====================================');
//     })
//     .catch((error) => {
//         console.error('Error fetching results:', error);
//     });
sSql.findAllWithCount('users', ['first_name', 'email'], 'id', {
    gender: 'Male',
})
    .then((results) => {
    console.log('====================================');
    console.log(results);
    console.log('====================================');
})
    .catch((error) => {
    console.error('Error fetching results:', error);
});
