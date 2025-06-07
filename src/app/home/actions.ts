"use server"

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Query } from "@/lib/drizzle/query";
import { Note, Project, Task } from "@/lib/drizzle/type";

export const getProjects = async (userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const projects = await Query.getProjects(userId);
    return projects;
}

export const getProjectById = async (projectId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");

    const project = await Query.getProjectById(projectId, session.user.id);
    return project;
}

export const createProject = async (userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.createProject(userId);
    return project;
}

export const updateProject = async (userId: string, updatedProject: Project) => {
    const session = await getUserSession();
    
    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.updateProject(userId, updatedProject.id, updatedProject);
    return project;
}

export const deleteProject = async (projectId: string, userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.deleteProject(projectId, userId);
    return project;
}

export const createTask = async (userId: string, newTask: Omit<Task, 'id'>) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(newTask.projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const task = await Query.createTask(newTask);
    return task;
}

export const updateTask = async (userId: string, updatedTask: Task) => {
    const session = await getUserSession();
    
    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(updatedTask.projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const task = await Query.updateTask(updatedTask.id, updatedTask);
    return task;
}

export const deleteTask = async (userId: string, projectId: string, taskId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const deletedTask = await Query.deleteTask(taskId);
    return deletedTask;
}

export const createNote = async (userId: string, newNote: Omit<Note, 'id'>) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(newNote.projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const note = await Query.createNote(newNote);
    return note;
}

export const updateNote = async (userId: string, updatedNote: Note) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(updatedNote.projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const note = await Query.updateNote(updatedNote.id, updatedNote);
    return note;
}

export const deleteNote = async (userId: string, projectId: string, noteId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const project = await Query.getProjectById(projectId, userId);
    if(!project) throw new Error("Project not found or you do not have access to it!");

    const deletedNote = await Query.deleteNote(noteId);
    return deletedNote;
}

async function getUserSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}