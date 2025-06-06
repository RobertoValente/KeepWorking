"use server"

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Query } from "@/lib/drizzle/query";

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

async function getUserSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}