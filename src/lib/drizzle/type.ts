import { account, session, user, verification, project, task, note, webhook, log } from "@/lib/drizzle/schema";

export type Account = typeof account.$inferInsert
export type Session = typeof session.$inferInsert
export type User = typeof user.$inferInsert
export type Verification = typeof verification.$inferInsert
export type Project = typeof project.$inferInsert
export type Task = typeof task.$inferInsert
export type Note = typeof note.$inferInsert
export type ProjectWithTasksAndNotes = Project & { tasks: Task[]; notes: Note[]; }
export type Webhook = typeof webhook.$inferInsert
export type Log = typeof log.$inferInsert
export type WebhookWithLogs = Webhook & { logs: Log[]; }