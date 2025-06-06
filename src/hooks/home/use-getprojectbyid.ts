import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/app/home/actions';

export const useGetProjectById = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => getProjectById(projectId),
        enabled: !!projectId,
    });
}