import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'localhost',
  port: 4000,
  user: 'root',
  password: '123456',
  database: 'ospdb'
})

