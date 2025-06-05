import { account, session, user, verification } from "@/lib/drizzle/schema";

export type Account = typeof account.$inferInsert
export type Session = typeof session.$inferInsert
export type User = typeof user.$inferInsert
export type Verification = typeof verification.$inferInsert