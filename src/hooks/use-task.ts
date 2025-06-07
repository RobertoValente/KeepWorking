import { Task } from '@/lib/drizzle/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/app/home/actions';

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, newTask} : { userId: string, newTask: Omit<Task, 'id'> }) => createTask(userId, newTask),
        onSuccess: (newTask) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', newTask.projectId], (oldData: any) => {
                if (!oldData) return null;
                return {
                    ...oldData,
                    tasks: [...(oldData.tasks || []), newTask],
                };
            });
        },
    });
}

/*export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, updatedProject} :  { userId: string, updatedProject: Project }) => updateProject(userId, updatedProject),
        onSuccess: (nullValueIdkWhy, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects', variables.userId] });
            queryClient.setQueryData(['projects', variables.userId], (oldData: Project[]) => {
                return oldData?.map(project => project.id === variables.updatedProject.id ? variables.updatedProject : project) || [];
            });
            queryClient.setQueryData(['project', variables.updatedProject.id], variables.updatedProject);
        }
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) => deleteProject(projectId, userId),
        onSuccess: (deletedProject, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects', variables.userId] });
            queryClient.setQueryData(['projects', variables.userId], (oldData: Project[]) => {
                return oldData?.filter(project => project.id !== variables.projectId) || [];
            });
        },
    });
}*/