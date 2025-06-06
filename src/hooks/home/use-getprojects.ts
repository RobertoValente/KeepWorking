import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/app/home/actions';

export const useProjects = (userId: string) => {
    return useQuery({
        queryKey: ['projects', userId],
        queryFn: async () => getProjects(userId),
        enabled: !!userId
    });
}