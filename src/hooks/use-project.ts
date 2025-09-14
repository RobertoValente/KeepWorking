import { Project } from '@/lib/drizzle/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '@/app/home/projects/actions';

export const useGetProjects = (userId: string) => {
    return useQuery({
        queryKey: ['projects', userId],
        queryFn: async () => getProjects(userId),
        enabled: !!userId
    });
}

export const useGetProjectById = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const project = await getProjectById(projectId);
            if (project && Array.isArray(project.tasks)) {
                const priorityOrder: Record<string, number> = { urgent: 0, important: 1, normal: 2 };
                project.tasks = project.tasks.sort((a, b) => {
                    if ((a.isDone ?? 0) !== (b.isDone ?? 0)) {
                        return (a.isDone ?? 0) - (b.isDone ?? 0);
                    }
                    return (priorityOrder[a.priority as string] ?? 3) - (priorityOrder[b.priority as string] ?? 3);
                });
            }
            return project;
        },
        enabled: !!projectId,
    });
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => createProject(userId),
        onSuccess: (newProject, userId) => {
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.setQueryData(['projects', userId], (oldData: Project[]) => {
                return [newProject, ...(oldData || [])];
            });
        },
    });
}

export function useUpdateProject() {
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
            queryClient.removeQueries({ queryKey: ['project', variables.projectId] });
        },
    });
}