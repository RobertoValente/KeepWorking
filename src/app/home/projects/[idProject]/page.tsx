"use client"

import EditProjectModal from "@/components/(home)/modals/project/EditProject";
import DeleteProjectModal from "@/components/(home)/modals/project/DeleteProject";
import CreateTaskModal from "@/components/(home)/modals/task/CreateTask";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectById } from "@/hooks/use-project";
import { CircleDot, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

function formatDate(date: Date | string | undefined): string {
    if (!date) return null as unknown as string;
    
    if (typeof date === 'string') {
        date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null as unknown as string;
    }
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

export default function ProjectPage() {
    const params = useParams();

    const [editProject, setEditProject] = useState(false);
    const [deleteProject, setDeleteProject] = useState(false);
    const [createTask, setCreateTask] = useState(false);
    
    const { data: project, isLoading, error, isError } = useGetProjectById(params.idProject as string);
    if(isError) console.error("Error loading projects:", error);

    return (
        <>  
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-4 animate-spin m-auto mt-2" />
                </div>
            ) : isError ? (
                <span className="text-center text-[13px] text-muted-foreground mt-1">
                    Error loading project!
                </span>
            ) : !project ? (
                <span className="text-center text-[13px] mx-2 text-muted-foreground mt-1">
                    Nothing found!
                </span>
            ) : (
                <>
                    {/*<ProjectDetails project={project} />*/}
                    <div id="project-details">
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <h1 className="text-4xl font-bold mr-2">{project.name}</h1>
                            <Button
                                variant="outline" size="icon" className="cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors"
                                onClick={() => setEditProject(true)}
                            >
                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                            </Button>
                            <Button
                                onClick={() => setDeleteProject(true)}
                                variant="outline" size="icon" className="cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                <Trash2 className="size-4 text-red-500 dark:text-red-400" />
                            </Button>
                        </div>
                        <div className="text-base -mt-2">
                            {/*{project.description && ( <span>{project.description} <br /></span> )}*/}

                            <span className="italic text-gray-600 dark:text-gray-400">
                                Created on {formatDate(project.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div id="project-content" className="mt-4">
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Project Details</h2>
                        </div>

                        <Tabs defaultValue="tasks">
                            <TabsList className="absolute right-6 -mt-13">
                                <TabsTrigger value="tasks" className="cursor-pointer">Tasks</TabsTrigger>
                                <TabsTrigger value="notes" className="cursor-pointer">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tasks">
                                <Card className="w-full p-2">
                                    <CardHeader className="p-2">
                                        <CardDescription>
                                            <Button onClick={() => setCreateTask(true)} className="cursor-pointer w-full" variant="outline">
                                                <Plus className="size-4" />
                                            </Button>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="-mt-8 p-2 text-center">
                                        {!project.tasks || project.tasks.length === 0 ? (
                                            <span className="text-[13px] text-muted-foreground">
                                                No tasks found!
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-4 w-full">
                                                {project.tasks.map(task => (
                                                    <div
                                                        key={task.id}
                                                        className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm w-full max-w-full sm:max-w-none text-center sm:text-left flex-1 min-w-[280px]"
                                                    >
                                                        <div className="flex items-center gap-3 w-full">
                                                            <Checkbox
                                                                id={`task-${task.id}`}
                                                                checked={!!task.isDone}
                                                                onChange={() => alert(`Toggle done for task: ${task.content}`)}
                                                                className="cursor-pointer size-5 "
                                                            />
                                                            <CircleDot
                                                                className="!size-3"
                                                                style={{
                                                                    color: task.priority === 'urgent' ? 'red' : task.priority === 'important' ? 'orange' : 'green',
                                                                    fill: task.priority === 'urgent' ? 'red' : task.priority === 'important' ? 'orange' : 'green'
                                                                }}
                                                            />
                                                            <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                                                                <h3 className="font-medium truncate w-full break-words whitespace-pre-line text-balance">
                                                                    {task.content}
                                                                </h3>
                                                                
                                                                {task.dueDate && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Complete until: {formatDate(task.dueDate)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button
                                                                onClick={() => alert(`Edit task: ${task.content}`)}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Edit task"
                                                            >
                                                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => alert(`Delete task: ${task.content}`)}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Delete task"
                                                            >
                                                                <X className="size-4 text-red-500 dark:text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            
                            <TabsContent value="notes">
                                <Card className="w-full p-2">
                                    <CardHeader className="p-2">
                                        <CardDescription>
                                            <Button className="cursor-pointer w-full" variant="outline">
                                                <Plus className="size-4" />
                                            </Button>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="-mt-8 p-2 text-center">
                                        {!project.notes || project.notes.length === 0 ? (
                                            <span className="text-[13px] text-muted-foreground">
                                                No notes found!
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-4 w-full">
                                                {project.notes.map(note => (
                                                    <div
                                                        key={note.id}
                                                        className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm w-full max-w-full sm:max-w-none text-center sm:text-left flex-1 min-w-[280px]"
                                                    >
                                                        <div className="flex items-center gap-3 w-full">
                                                            {note.isPinned && (<CircleDot className="!size-3 text-yellow-500 fill-yellow-500" />)}
                                                            <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                                                                <h3 className="font-medium truncate w-full break-words whitespace-pre-line text-balance">
                                                                    {note.content}
                                                                </h3>
                                                            </div>
                                                            <Button
                                                                onClick={() => alert(`Edit note: ${note.content}`)}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Edit note"
                                                            >
                                                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => alert(`Delete note: ${note.content}`)}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Delete note"
                                                            >
                                                                <X className="size-4 text-red-500 dark:text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <EditProjectModal
                            isOpen={editProject}
                            onOpenChange={setEditProject}
                            project={project}
                        />

                        <DeleteProjectModal
                            isOpen={deleteProject}
                            onOpenChange={setDeleteProject}
                            project={project}
                        />

                        <CreateTaskModal
                            isOpen={createTask}
                            onOpenChange={setCreateTask}
                            projectId={project.id}
                        />
                    </div>
                </>
            )}
        </>
    );
}