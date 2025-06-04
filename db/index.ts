import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema&relation'
// import * as relations from './relations/index'

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

