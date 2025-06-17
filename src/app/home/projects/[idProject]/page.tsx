"use client"

import EditProjectModal from "@/components/(home)/modals/project/EditProject";
import DeleteProjectModal from "@/components/(home)/modals/project/DeleteProject";
import CreateTaskModal from "@/components/(home)/modals/task/CreateTask";
import EditTaskModal from "@/components/(home)/modals/task/EditTask";
import DeleteTaskModal from "@/components/(home)/modals/task/DeleteTask";
import CreateNoteModal from "@/components/(home)/modals/note/CreateNote";
import EditNoteModal from "@/components/(home)/modals/note/EditNote";
import DeleteNoteModal from "@/components/(home)/modals/note/DeleteNote";
import { useIsDoneTask } from "@/hooks/use-task";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectById } from "@/hooks/use-project";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Note, Task } from "@/lib/drizzle/type";
import { toast } from "sonner";

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
    const changeIsDoneTask = useIsDoneTask();

    const [editProject, setEditProject] = useState(false);
    const [deleteProject, setDeleteProject] = useState(false);

    const [createTask, setCreateTask] = useState(false);
    const [updateTask, setUpdateTask] = useState(false);
    const [deleteTask, setDeleteTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [createNote, setCreateNote] = useState(false);
    const [updateNote, setUpdateNote] = useState(false);
    const [deleteNote, setDeleteNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const isAnyModalOpen = editProject || deleteProject || createTask || updateTask || deleteTask || createNote || updateNote || deleteNote;

    const handleIsDoneTask = (changedIsDoneTask: Task) => {
        changedIsDoneTask.isDone = changedIsDoneTask.isDone === 1 ? 0 : 1;

        changeIsDoneTask.mutate({
            changedIsDoneTask: changedIsDoneTask,
        }, {
            onError: (error) => {
                console.error("Error updating task status:", error);
                toast.error(`Failed to mark task as ${changedIsDoneTask.isDone ? 'done' : 'not done'}`);
            }
        }
    )};
    
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
                    <div id="project-details" className={isAnyModalOpen ? "blur-xs transition-all" : "transition-all"}>
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <h1 className="text-4xl font-bold mr-2">{project.name}</h1>
                        </div>
                        <div className="text-base -mt-2">
                            {/*{project.description && ( <span>{project.description} <br /></span> )}*/}

                            <span className="italic text-gray-600 dark:text-gray-400">
                                Created on {formatDate(project.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                variant="outline" className="cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors"
                                onClick={() => setEditProject(true)}
                            >
                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                Edit Project
                            </Button>
                            <Button
                                onClick={() => setDeleteProject(true)}
                                variant="outline" className="cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                <Trash2 className="size-4 text-red-500 dark:text-red-400" />
                                Delete Project
                            </Button>
                        </div>
                    </div>

                    <div id="project-content" className={`mt-4 ${isAnyModalOpen ? "blur-sm pointer-events-none select-none transition-all" : "transition-all"}`}>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Project Details</h2>
                        </div>

                        <Tabs defaultValue="tasks">
                            <TabsList className="absolute right-6 -mt-13">
                                <TabsTrigger value="tasks" className="cursor-pointer">Tasks</TabsTrigger>
                                <TabsTrigger value="notes" className="cursor-pointer">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tasks">
                                {/*<Card className="w-full p-2 border-0 shadow-none">*/}
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
                                                                checked={task.isDone === 1}
                                                                onClick={() => handleIsDoneTask(task)}
                                                                className="cursor-pointer size-5 border-2"
                                                                title="Mark task as done"
                                                                style={{
                                                                    borderColor: task.priority === 'urgent' ? '#f14445' : task.priority === 'important' ? '#f87103' : '#20c45f',
                                                                    backgroundColor: task.priority === 'urgent' && task.isDone ? '#f14445' : task.priority === 'important'  && task.isDone ? '#f87103' : task.priority === "normal"  && task.isDone ? '#20c45f' : undefined,
                                                                }}
                                                            />
                                                            <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                                                                <span className="font-medium truncate w-full break-words whitespace-pre-line pr-2 sm:pr-3">
                                                                    {task.content}
                                                                </span>
                                                                
                                                                {task.dueDate && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Complete until: {formatDate(task.dueDate)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button
                                                                onClick={() => {setSelectedTask(task); setUpdateTask(true)}}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Edit task"
                                                            >
                                                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => {setSelectedTask(task); setDeleteTask(true)}}
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
                                            <Button onClick={() => setCreateNote(true)} className="cursor-pointer w-full" variant="outline">
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
                                                        style={{
                                                            borderColor: note.isPinned ? '#f9cc21' : undefined,
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
                                                                <h3 className="font-medium truncate w-full break-words whitespace-pre-line pr-2 sm:pr-3">
                                                                    {note.content}
                                                                </h3>
                                                            </div>
                                                            <Button
                                                                onClick={() => {setSelectedNote(note); setUpdateNote(true)}}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Edit note"
                                                            >
                                                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => {setSelectedNote(note); setDeleteNote(true)}}
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

                        <EditTaskModal
                            isOpen={updateTask}
                            onOpenChange={setUpdateTask}
                            task={selectedTask as Task}
                        />

                        <DeleteTaskModal
                            isOpen={deleteTask}
                            onOpenChange={setDeleteTask}
                            projectId={project.id}
                            task={selectedTask as Task}
                        />

                        <CreateNoteModal
                            isOpen={createNote}
                            onOpenChange={setCreateNote}
                            projectId={project.id}
                        />

                        <EditNoteModal
                            isOpen={updateNote}
                            onOpenChange={setUpdateNote}
                            note={selectedNote as Note}
                        />

                        <DeleteNoteModal
                            isOpen={deleteNote}
                            onOpenChange={setDeleteNote}
                            projectId={project.id}
                            note={selectedNote as Note}
                        />
                    </div>
                </>
            )}
        </>
    );
}