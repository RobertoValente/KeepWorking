"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectById } from "@/hooks/home/use-getprojectbyid";
import { CircleCheckBig, CircleDot, ClipboardPen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

function formatDate(date: Date | string | undefined): string {
    if (!date) return "Unknown date";
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

export default function ProjectPage() {
    const params = useParams();
    
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
                            <Button variant="outline" size="icon" className="cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors">
                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                            </Button>
                            <Button variant="outline" size="icon" className="cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
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
                                    <CardHeader className="p-0">
                                        <CardDescription>
                                            <Button className="cursor-pointer w-full" variant="outline">
                                                <Plus className="size-4" />
                                            </Button>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="-mt-4 p-2 text-center">
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
                                                            <Input
                                                                id={`task-${task.id}`}
                                                                type="checkbox"
                                                                checked={!!task.isDone}
                                                                onChange={() => alert(`Toggle done for task: ${task.content}`)}
                                                                className="accent-green-500 size-5 cursor-pointer"
                                                            />
                                                            <CircleDot
                                                                className="!size-2"
                                                                style={{
                                                                    color: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green',
                                                                    fill: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'
                                                                }}
                                                            />
                                                            <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                                                                <h3 className="font-semibold truncate w-full break-words whitespace-pre-line text-balance">
                                                                    {task.content}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {task.dueDate && (
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Complete until: {formatDate(task.dueDate)}</span>
                                                                    )}
                                                                </div>
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
                                                                <Trash2 className="size-4 text-red-500 dark:text-red-400" />
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
                                Bbbb
                            </TabsContent>
                        </Tabs>
                        
                        {/*<Button className="cursor-pointer" variant={"outline"} size="icon">
                            <CircleCheckBig className="size-4" />
                        </Button>
                        <Button className="cursor-pointer" variant={"outline"} size="icon">
                            <ClipboardPen className="size-4" />
                        </Button>*/}
                    </div>
                </>
            )}
        </>
    );
}