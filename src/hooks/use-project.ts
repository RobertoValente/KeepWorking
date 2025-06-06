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
            queryClient.setQueryData(['projects', userId], (oldData: any) => {
                return [...(oldData || []), newProject];
            });
        },
    });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: async ({ projectId, userId, data }: { projectId: string; userId: string; data: { name?: string; description?: string; color?: string } }) => {
      return updateProject(projectId, userId, data);
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      return deleteProject(projectId, userId);
    },
  });
}