import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/app/home/actions';

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => createProject(userId),
        onSuccess: (newProject, userId) => {
            queryClient.invalidateQueries({ queryKey: ['projects', userId] });
            queryClient.setQueryData(['projects', userId], (oldData: any) => {
                // Append the new project to the existing list
                return [...(oldData || []), newProject];
            });
        },
    });
}