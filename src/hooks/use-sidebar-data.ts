import { useQueries } from '@tanstack/react-query';
import { getProjects } from '@/app/home/projects/actions';
import { getWebhooks } from '@/app/home/webhooks/actions';

export const useSidebarData = (userId: string) => {
    const results = useQueries({
        queries: [
            {
                queryKey: ['projects', userId],
                queryFn: async () => getProjects(userId),
                enabled: !!userId
            },
            {
                queryKey: ['webhooks', userId],
                queryFn: async () => getWebhooks(userId),
                enabled: !!userId
            }
        ]
    });

    const [projectsQuery, webhooksQuery] = results;

    return {
        projects: {
            data: projectsQuery.data,
            isLoading: projectsQuery.isLoading,
            error: projectsQuery.error,
            isError: projectsQuery.isError
        },
        webhooks: {
            data: webhooksQuery.data,
            isLoading: webhooksQuery.isLoading,
            error: webhooksQuery.error,
            isError: webhooksQuery.isError
        },
        isLoading: projectsQuery.isLoading || webhooksQuery.isLoading,
        isAllLoaded: !projectsQuery.isLoading && !webhooksQuery.isLoading,
        hasError: projectsQuery.isError || webhooksQuery.isError
    };
};