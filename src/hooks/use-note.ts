import { Note } from '@/lib/drizzle/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, updateNote, deleteNote } from '@/app/home/projects/actions';


export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, newNote} : { userId: string, newNote: Omit<Note, 'id'> }) => createNote(userId, newNote),
        onSuccess: (newNote) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', newNote.projectId], (oldData: any) => {
                if (!oldData) return null;
                return {
                    ...oldData,
                    notes: [...(oldData.notes || []), newNote].sort((a, b) => {
                        const pinnedDiff = (b.isPinned ?? 0) - (a.isPinned ?? 0);
                        if (pinnedDiff !== 0) return pinnedDiff;
                        return (a.title || '').localeCompare(b.title || '');
                    }),
                };
            });
        },
    });
}

export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, updatedNote} : { userId: string, updatedNote: Note }) => updateNote(userId, updatedNote),
        onSuccess: (updatedNote, variables) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', variables.updatedNote.projectId], (oldData: any) => {
                if (!oldData) return null;
                const updatedNotes = oldData.notes?.map((note: Note) => note.id === variables.updatedNote.id ? variables.updatedNote : note) || [];
                return {
                    ...oldData,
                    notes: updatedNotes.sort((a: Note, b: Note) => {
                        const pinnedDiff = (b.isPinned ?? 0) - (a.isPinned ?? 0);
                        if (pinnedDiff !== 0) return pinnedDiff;
                        return (a.title || '').localeCompare(b.title || '');
                    }),
                };
            });
        },
    });
}

export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({noteId, projectId, userId} : { noteId: string, projectId: string, userId: string }) => deleteNote(userId, projectId, noteId),
        onSuccess: (noteId, variables) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['project', variables.projectId], (oldData: any) => {
                if (!oldData) return null;
                return {
                    ...oldData,
                    notes: oldData.notes?.filter((note: Note) => note.id !== variables.noteId) || [],
                };
            });
        },
    });
}