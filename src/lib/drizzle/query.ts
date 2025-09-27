'server-only'

import { db } from "@/lib/drizzle/index";
import { user, project, task, note, webhook, log } from "@/lib/drizzle/schema";
import { User, Project, ProjectWithTasksAndNotes, Task, Note, Webhook, WebhookWithLogs, Log } from "@/lib/drizzle/type";
import { and, eq, desc, asc } from "drizzle-orm";

export const Query = {
    getProjects: async function(userId: string): Promise<Project[]> {
        return await db
            .select()
            .from(project)
            .where(
                and(
                    eq(project.isValid, 1),
                    eq(project.userId, userId)
                )
            )
            .orderBy(
                asc(project.name)
            );
    },

    getProjectById: async function(projectId: string, userId: string): Promise<ProjectWithTasksAndNotes | null> {
        return await db
            .select()
            .from(project)
            .leftJoin(task, eq(task.projectId, project.id))
            .leftJoin(note, eq(note.projectId, project.id))
            .where(
                and(
                    eq(project.id, projectId),
                    eq(project.userId, userId),
                    eq(project.isValid, 1)
                )
            )
            .orderBy(
                asc(project.name),
                asc(task.content),
                asc(note.title)
            )
            .then((rows) => {
                if (!rows.length) return null;

                const projectData = rows[0].project;
                
                const priorityOrder: Record<string, number> = { urgent: 0, important: 1, normal: 2 };
                const tasks = rows
                    .map(row => row.task)
                    .filter((task): task is Exclude<typeof task, null> => task !== null)
                    .filter((task, idx, arr) => arr.findIndex(t => t.id === task.id) === idx)
                    .sort((a, b) => {
                        if ((a.isDone ?? 0) !== (b.isDone ?? 0)) return (a.isDone ?? 0) - (b.isDone ?? 0);
                        const priorityDiff = (priorityOrder[a.priority as string] ?? 3) - (priorityOrder[b.priority as string] ?? 3);
                        if (priorityDiff !== 0) return priorityDiff;
                        return (a.content || '').localeCompare(b.content || '');
                    });
                
                const notes = rows
                    .map(row => row.note)
                    .filter((note): note is Exclude<typeof note, null> => note !== null)
                    .filter((note, idx, arr) => arr.findIndex(n => n.id === note.id) === idx)
                    .sort((a, b) => {
                        const pinnedDiff = (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
                        if (pinnedDiff !== 0) return pinnedDiff;
                        return (a.title || '').localeCompare(b.title || '');
                    });

                return {
                    ...projectData,
                    tasks,
                    notes,
                };
            });
    },

    createProject: async function(userId: string): Promise<Project> {
        const newProject = {
            id: crypto.randomUUID(),
            userId,
            name: "New Project",
            description: "",
            color: "blue",
            isValid: 1,
        };

        await db
            .insert(project)
            .values(newProject)

        return newProject;
    },

    updateProject: async function(userId: string, projectId: string, updates: Partial<Project>): Promise<void> {
        await db
            .update(project)
            .set(updates)
            .where(
                and(
                    eq(project.id, projectId),
                    eq(project.userId, userId)
                )
            );
    },

    deleteProject: async function(projectId: string, userId: string): Promise<void> {
        await db
            .update(project)
            .set({ isValid: 0 })
            .where(
                and(
                    eq(project.id, projectId),
                    eq(project.userId, userId)
                )
            );
    },

    createTask: async function(newTask: Omit<Task, 'id'>): Promise<Task> {
        const taskWithId: Task = {
            ...newTask,
            id: crypto.randomUUID(),
        };

        await db
            .insert(task)
            .values(taskWithId);
        
        const insertedTask = await db
            .select()
            .from(task)
            .where(eq(task.id, taskWithId.id))
            .then(rows => rows[0]);

        return insertedTask;
    },

    updateTask: async function(taskId: string, updates: Partial<Task>): Promise<void> {
        await db
            .update(task)
            .set(updates)
            .where(eq(task.id, taskId));
    },

    deleteTask: async function(taskId: string): Promise<void> {
        await db
            .delete(task)
            .where(eq(task.id, taskId));
    },

    setIsDoneTask: async function(taskId: string, isDoneNow: number): Promise<void> {
        await db
            .update(task)
            .set({ isDone: isDoneNow })
            .where(eq(task.id, taskId));
    },

    createNote: async function(newNote: Omit<Note, 'id'>): Promise<Note> {
        const noteWithId: Note = {
            ...newNote,
            id: crypto.randomUUID(),
        };

        await db
            .insert(note)
            .values(noteWithId);

        const insertedNote = await db
            .select()
            .from(note)
            .where(eq(note.id, noteWithId.id))
            .then(rows => rows[0]);
        
        return insertedNote;
    },

    updateNote: async function(noteId: string, updates: Partial<Note>): Promise<void> {
        await db
            .update(note)
            .set(updates)
            .where(eq(note.id, noteId));
    },

    deleteNote: async function(noteId: string): Promise<void> {
        await db
            .delete(note)
            .where(eq(note.id, noteId));
    },

    getWebhooks: async function(userId: string): Promise<Webhook[]> {
        return await db
            .select()
            .from(webhook)
            .where(
                and(
                    eq(webhook.isValid, 1),
                    eq(webhook.userId, userId)
                )
            )
            .orderBy(
                asc(webhook.name)
            );
    },

    getWebhookById: async function(webhookId: string, userId: string): Promise<WebhookWithLogs | null> {
        return await db
            .select()
            .from(webhook)
            .leftJoin(log, eq(log.webhookId, webhook.id))
            .where(
                and(
                    eq(webhook.id, webhookId),
                    eq(webhook.userId, userId),
                    eq(webhook.isValid, 1)
                )
            )
            .orderBy(
                desc(webhook.createdAt),
                desc(log.timestamp)
            )
            .then((rows) => {
                if (!rows.length) return null;

                const webhookData = rows[0].webhook;
                
                const logs = rows
                    .map(row => row.log)
                    .filter((log): log is Exclude<typeof log, null> => log !== null)
                    .filter((log, idx, arr) => arr.findIndex(l => l.id === log.id) === idx)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                return {
                    ...webhookData,
                    logs,
                };
            });
    },

    createWebhook: async function(userId: string): Promise<Webhook> {
        const newWebhook = {
            id: crypto.randomUUID(),
            userId,
            name: "New Webhook",
            description: "",
            color: "blue",
            isValid: 1,
        };

        await db
            .insert(webhook)
            .values(newWebhook);

        return newWebhook;
    },

    updateWebhook: async function(userId: string, webhookId: string, updates: Partial<Webhook>): Promise<void> {
        await db
            .update(webhook)
            .set(updates)
            .where(
                and(
                    eq(webhook.id, webhookId),
                    eq(webhook.userId, userId)
                )
            );
    },

    deleteWebhook: async function(webhookId: string, userId: string): Promise<void> {
        await db
            .update(webhook)
            .set({ isValid: 0 })
            .where(
                and(
                    eq(webhook.id, webhookId),
                    eq(webhook.userId, userId)
                )
            );
    },

    createLog: async function(newLog: Omit<Log, 'id'>): Promise<Log> {
        const logWithId: Log = {
            ...newLog,
            id: crypto.randomUUID(),
        };
        
        await db
            .insert(log)
            .values(logWithId);

        const insertedLog = await db
            .select()
            .from(log)
            .where(eq(log.id, logWithId.id))
            .then(rows => rows[0]);
        
        return insertedLog;
    },

    deleteLog: async function(logId: string): Promise<void> {
        await db
            .delete(log)
            .where(eq(log.id, logId));
    },

    getUsers: async function(): Promise<User[]> {
        return await db
            .select()
            .from(user)
            .orderBy(
                desc(user.name)
            );
    },
}