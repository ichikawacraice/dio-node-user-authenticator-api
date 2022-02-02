import { Pool } from 'pg';
import config from 'config';

const connectionString = config.get<sting>('database.uri');

const db = new Pool({ connectionString });

export default db;
