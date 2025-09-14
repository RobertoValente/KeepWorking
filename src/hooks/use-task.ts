import { Task } from '@/lib/drizzle/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask, isDoneTask } from '@/app/home/projects/actions';

export function useCreateTask() {
    const queryClient = useQueryClient();
    const priorityOrder: Record<string, number> = { urgent: 0, important: 1, normal: 2 };

    return useMutation({
        mutationFn: ({userId, newTask} : { userId: string, newTask: Omit<Task, 'id'> }) => createTask(userId, newTask),
        onSuccess: (newTask) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', newTask.projectId], (oldData: any) => {
                if (!oldData) return null;
                return {
                    ...oldData,
                    tasks: [...(oldData.tasks || []), newTask].sort((a: Task, b: Task) => {
                        if ((a.isDone ?? 0) !== (b.isDone ?? 0)) return (a.isDone ?? 0) - (b.isDone ?? 0);
                        return (priorityOrder[a.priority as string] ?? 3) - (priorityOrder[b.priority as string] ?? 3);
                    }),
                };
            });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, updatedTask} : { userId: string, updatedTask: Task }) => updateTask(userId, updatedTask),
        onSuccess: (updatedTask, variables) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', variables.updatedTask.projectId], (oldData: any) => {
                if (!oldData) return null;
                const priorityOrder: Record<string, number> = { urgent: 0, important: 1, normal: 2 };
                const updatedTasks = oldData.tasks?.map((task: Task) => task.id === variables.updatedTask.id ? variables.updatedTask : task) || [];
                return {
                    ...oldData,
                    tasks: updatedTasks.sort((a: Task, b: Task) => {
                        if ((a.isDone ?? 0) !== (b.isDone ?? 0)) return (a.isDone ?? 0) - (b.isDone ?? 0);
                        return (priorityOrder[a.priority as string] ?? 3) - (priorityOrder[b.priority as string] ?? 3);
                    }),
                };
            });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, projectId, userId} : { taskId: string, projectId: string, userId: string }) => deleteTask(userId, projectId, taskId),
        onSuccess: (taskId, variables) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', variables.projectId], (oldData: any) => {
                if (!oldData) return null;
                return {
                    ...oldData,
                    tasks: oldData.tasks?.filter((task: Task) => task.id !== variables.taskId) || [],
                };
            });
        },
    });
}

export function useIsDoneTask() {
    const queryClient = useQueryClient();
    const priorityOrder: Record<string, number> = { urgent: 0, important: 1, normal: 2 };

    return useMutation({
        mutationFn: ({changedIsDoneTask} : { changedIsDoneTask: Task}) => isDoneTask(changedIsDoneTask),
        onSuccess: (updatedTask, variables) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', variables.changedIsDoneTask.projectId], (oldData: any) => {
                if (!oldData) return null;

                const updatedTasks = oldData.tasks?.map((task: Task) =>
                    task.id === variables.changedIsDoneTask.id ? variables.changedIsDoneTask : task
                ) || [];

                return {
                    ...oldData,
                    tasks: updatedTasks.sort((a: Task, b: Task) => {
                        if ((a.isDone ?? 0) !== (b.isDone ?? 0)) return (a.isDone ?? 0) - (b.isDone ?? 0);
                        return (priorityOrder[a.priority as string] ?? 3) - (priorityOrder[b.priority as string] ?? 3);
                    }),
                };
            });
        },
    });
}