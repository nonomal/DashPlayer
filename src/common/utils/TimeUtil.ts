import moment from 'moment';
import StrUtil from '@/common/utils/str-util';
import { TypeGuards } from '@/backend/utils/TypeGuards';
import { Nullable } from '@/common/types/Types';

export default class TimeUtil {
    public static secondToTimeStrCompact(second: Nullable<number>): string {
        if (second === null || second === undefined) {
            return '';
        }
        const h = Math.floor(second / 3600);
        const m = Math.floor(second % 3600 / 60);
        const s = Math.floor(second % 60);
        return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    }

    /**
     * 00:00:00
     * @param second
     */
    public static secondToTimeStr(second: Nullable<number>): string {
        if (TypeGuards.isNull(second)) {
            return '';
        }
        return moment.utc(second * 1000).format('HH:mm:ss');
    }

    /**
     * 00:00:00.000
     * @param second
     */
    public static secondToTimeStrWithMs(second: Nullable<number>): string {
        if (TypeGuards.isNull(second)) {
            return '';
        }
        return moment.utc(second * 1000).format('HH:mm:ss.SSS');
    }

    public static isoToDate(iso: Nullable<string>): Date {
        if (StrUtil.isBlank(iso)) {
            return new Date();
        }
        const date = moment.utc(iso, ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DD HH:mm:ss']);
        if (!date.isValid()) {
            return new Date();
        }
        return date.toDate();
    }

    public static dateToRelativeTime(date: Date): string {
        return moment(date).fromNow();
    }

    public static toGroupMiddle(seconds: number): number {
        const segment = Math.floor(seconds / 15);
        return segment * 15 + 7.5;
    }

    /**
     * 当前时间的数据库格式
     */
    public static timeUtc(): string {
        return moment.utc().format('YYYY-MM-DD HH:mm:ss');
    }

    public static dateToUtc(date: Date): string {
        return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 输入时间字符串，返回秒数
     * @param duration
     */
    public static parseDuration(duration: string): number {
        return moment.duration(duration).asSeconds();
    }

    /**
     * 00:00:00 转 00时00分00秒
     */
    public static timeStrToChinese(timeStr: string): string {
        const [h, m, s] = timeStr.split(':');
        return `${h}时${m}分${s}秒`;
    }

}
