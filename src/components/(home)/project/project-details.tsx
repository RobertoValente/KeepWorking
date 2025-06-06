"use client"

import { Project } from "@/lib/drizzle/type"

type ProjectDetailsProps = {
    project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
    if (!project) return <>{"Project not found!"}</>;

    return (
        <>
            Project ID: {project.id} <br />
            Project Name: {project.name} <br />
            Project Description: {project.description} <br />
            Project Color: {project.color} <br />
            Project User ID: {project.userId} <br />
            Project Valid: {project.isValid ? "Yes" : "No"} <br />
            Project Created At: {project?.createdAt ? project.createdAt.toString() : "N/A"} <br />
            Project Updated At: {project?.updatedAt ? project.updatedAt.toString() : "N/A"} <br />
        </>
    )
}