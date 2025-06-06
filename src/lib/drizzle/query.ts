'server-only'

import { db } from "@/lib/drizzle/index";
import { user, project, task, note } from "@/lib/drizzle/schema";
import { User, Project, ProjectWithTasksAndNotes } from "@/lib/drizzle/type";
import { and, eq, desc } from "drizzle-orm";

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
            ).then((rows) => {
                if (!rows.length) return null;

                const projectData = rows[0].project;
                const tasks = rows.map(row => row.task).filter((task): task is Exclude<typeof task, null> => task !== null);
                const notes = rows.map(row => row.note).filter((note): note is Exclude<typeof note, null> => note !== null);

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

    updateProject: async function(projectId: string, userId: string, updates: Partial<Project>): Promise<void> {
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

    getUsers: async function(): Promise<User[]> {
        return await db
            .select()
            .from(user)
            .orderBy(
                desc(user.name)
            );
    },
}