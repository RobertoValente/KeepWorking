import { Project } from '@/lib/drizzle/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '@/app/home/actions';

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
        queryFn: async () => getProjectById(projectId),
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
                return [...(oldData || []), newProject];
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
        },
    });
}