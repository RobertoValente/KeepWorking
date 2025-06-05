import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle(process.env.DATABASE_URL!);

//-> If MySQL Pool is required:
// 1. Access: https://orm.drizzle.team/docs/get-started/mysql-new#step-3---connect-drizzle-orm-to-the-database
// 2. Click 'your mysql2 driver'