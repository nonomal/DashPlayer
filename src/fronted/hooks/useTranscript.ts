import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import useDpTaskCenter from '@/fronted/hooks/useDpTaskCenter';
import toast from 'react-hot-toast';
import { SWR_KEY, swrMutate } from '@/fronted/lib/swr-util';
import { DpTaskState } from '@/backend/db/tables/dpTask';

const api = window.electron;

export interface TranscriptTask {
    file: string;
    taskId: number | null;
}

export type UseTranscriptState = {
    files: TranscriptTask[];
};

export type UseTranscriptAction = {
    onAddToQueue(p: string): void;
    onDelFromQueue(p: string): void;
    onTranscript(p: string): Promise<number>;
};


const useTranscript = create(
    persist(
        subscribeWithSelector<UseTranscriptState & UseTranscriptAction>((set, get) => ({
            files: [],
            onAddToQueue: async (p) => {
                const video = {
                    file: p,
                    taskId: null
                } as TranscriptTask;
                const currentFiles = get().files.map((f) => f.file);
                if (!currentFiles.includes(video.file)) {
                    set({ files: [...get().files, video] });
                }
            },
            onDelFromQueue(p: string) {
                const newFiles = get().files.filter((f) => f.file !== p);
                set({ files: newFiles });
            },
            onTranscript: async (file: string) => {
                const taskId = await useDpTaskCenter.getState().register(() => api.call('ai-func/transcript', { filePath: file }), {
                    onFinish: async (task) => {
                        if (task.status !== DpTaskState.DONE) return;
                        await api.call('watch-history/attach-srt', {
                            videoPath: file,
                            srtPath: 'same'
                        });
                        await swrMutate(SWR_KEY.PLAYER_P);
                        toast('Transcript done', {
                            icon: '🚀'
                        });
                    }
                });
                // 如果没有就新增，有就更新
                const currentFiles = get().files.map((f) => f.file);
                if (!currentFiles.includes(file)) {
                    set({ files: [...get().files, { file, taskId }] });
                } else {
                    const newFiles = get().files.map((f) => {
                        if (f.file === file) {
                            return { ...f, taskId };
                        }
                        return f;
                    });
                    set({ files: newFiles });
                }
                return taskId;
            }
        })),
        {
            name: 'transcript-page-info'
        }
    )
);


export default useTranscript;
