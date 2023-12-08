import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';
import { config } from 'dotenv';

config();

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.INS_NAME,
  ipType: 'PUBLIC',
});

const connection = () => {
  return mysql.createPool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
  });
};

export default connection();














// When using local MySQL
// const connection = () => {
//     config();
//     const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
//     return mysql.createPool({
//         host: DB_HOST,
//         user: DB_USER,
//         password: DB_PASSWORD,
//         database: DB_NAME,
//     });
// };

// export default connection().promise();