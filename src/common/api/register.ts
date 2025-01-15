import {ipcMain} from "electron";
import {ApiMap} from "@/common/api/api-def";
import SystemService from '@/backend/services/SystemService';
import dpLog from '@/backend/ioc/logger';
import container from '@/backend/ioc/inversify.config';
import TYPES from '@/backend/ioc/types';


export default function registerRoute<K extends keyof ApiMap>(path: K, func: ApiMap[K]) {
    ipcMain.handle(path, (_event, param) => {
        dpLog.log('api-call', path, JSON.stringify(param));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return func(param).catch((e: Error) => {
            dpLog.error('api-error', path, e);
            container.get<SystemService>(TYPES.SystemService).sendErrorToRenderer(e);
            throw e
        });
    });
}
