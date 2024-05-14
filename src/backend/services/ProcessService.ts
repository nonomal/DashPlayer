import {ChildProcess} from "child_process";
import DpTaskService from "@/backend/services/DpTaskService";
import {DpTaskState} from "@/backend/db/tables/dpTask";
import Ffmpeg from "fluent-ffmpeg";
import {CancelTokenSource} from "axios";

export default class ProcessService {
    private static readonly taskProcessMapping: Map<number, ChildProcess[]> = new Map();
    private static readonly taskFfmpegMapping: Map<number, Ffmpeg.FfmpegCommand[]> = new Map();
    //cancelTokenSource
    private static readonly cancelTokenSourceMapping: Map<number, CancelTokenSource[]> = new Map();

    public static registerTask(taskId: number, process: ChildProcess[]) {
        this.register(taskId, process, this.taskProcessMapping, 'close');
    }

    public static registerFfmpeg(taskId: number, process: Ffmpeg.FfmpegCommand[]) {
        this.register(taskId, process, this.taskFfmpegMapping, 'end');
    }

    public static registerCancelTokenSource(taskId: number, process: CancelTokenSource[]) {
        this.register(taskId, process, this.cancelTokenSourceMapping);
    }

    private static register(taskId: number, process: any[], mapping: Map<number, any[]>, event?: string) {
        const existingProcesses = mapping.get(taskId) || [];
        mapping.set(taskId, [...existingProcesses, ...process]);

        if (event) {
            process.forEach(p => {
                p.on(event, () => {
                    const processes = mapping.get(taskId);
                    if (processes) {
                        const newProcesses = processes.filter(pp => pp !== p);
                        mapping.set(taskId, newProcesses);
                    }
                });
            });
        }
    }

    public static killTask(taskId: number) {
        ProcessService.killProcess(taskId);
        ProcessService.killFfmpeg(taskId);
    }

    private static killProcess(taskId: number) {
        const childProcesses = ProcessService.taskProcessMapping.get(taskId);
        if (childProcesses) {
            childProcesses.forEach(p => {
                p.on('close', () => {
                    DpTaskService.update({
                        id: taskId,
                        status: DpTaskState.CANCELLED,
                        progress: '任务取消',
                    });
                });
                p.kill();
            });
        }
    }

    private static killFfmpeg(taskId: number) {
        const childProcesses = ProcessService.taskFfmpegMapping.get(taskId);
        if (childProcesses) {
            childProcesses.forEach(p => {
                p.on('end', () => {
                    DpTaskService.update({
                        id: taskId,
                        status: DpTaskState.CANCELLED,
                        progress: '任务取消',
                    });
                });
                p.kill('SIGKILL');
            });
        }
    }
}
