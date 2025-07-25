import { account, session, user, verification, project, task, note } from "@/lib/drizzle/schema";

export type Account = typeof account.$inferInsert
export type Session = typeof session.$inferInsert
export type User = typeof user.$inferInsert
export type Verification = typeof verification.$inferInsert
export type Project = typeof project.$inferInsert
export type Task = typeof task.$inferInsert
export type Note = typeof note.$inferInsert
export type ProjectWithTasksAndNotes = Project & { tasks: Task[]; notes: Note[]; }