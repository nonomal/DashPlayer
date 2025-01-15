import useFavouriteClip from '@/fronted/hooks/useFavouriteClip';
import React, { useEffect } from 'react';
import { cn } from '@/fronted/lib/utils';
import UrlUtil from '@/common/utils/UrlUtil';
import { Button } from '@/fronted/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ClipMeta, OssBaseMeta, ClipSrtLine } from '@/common/types/clipMeta';
import { ClipTenderImpl } from '@/fronted/lib/SrtTender';


const FavouriteItem = ({ item }: { item: OssBaseMeta & ClipMeta }) => {
    console.log('fav item', item);
    const playInfo = useFavouriteClip(state => state.playInfo);
    const setPlayInfo = useFavouriteClip(state => state.setPlayInfo);
    const currentTime = useFavouriteClip(state => state.currentTime);
    const deleteClip = useFavouriteClip(state => state.deleteClip);
    const [currentLine, setCurrentLine] = React.useState<ClipSrtLine | null>(null);

    const tender = React.useMemo(() => {
        console.log('tender', item.clip_content, item.key);
        return new ClipTenderImpl(item.clip_content, item.key);
    }, [item.clip_content, item.key]);

    useEffect(() => {
        if (playInfo?.video.key !== item.key) {
            if (currentLine) {
                setCurrentLine(null);
            }
            return;
        }
        const valid = Date.now() - (playInfo?.timeUpdated ?? 0) > 500;
        const ct = valid ? currentTime : (playInfo?.time ?? 0);
        const line = tender?.getByTime(ct) ?? null;
        if (line !== currentLine) {
            setCurrentLine(line);
        }
    }, [currentLine, currentTime, item.key, playInfo, tender]);


    const lines: ClipSrtLine[] = item?.clip_content ?? [];
    return (
        <div key={item.key}
             className={cn('flex max-w-3xl items-start gap-4 rounded-xl pb-8')}>
            <div className="flex flex-col w-44 gap-1 h-full overflow-hidden p-2 select-text">
                <img
                    className={cn('w-full rounded-lg')}
                    src={UrlUtil.dp(item.baseDir, item.thumbnail_file)}
                    style={{
                        aspectRatio: '16/9'
                    }}
                    alt={''} />
            </div>
            <div className="w-0 flex-1 flex flex-col gap h-full overflow-hidden select-text">
                <div className={cn('text-base cursor-pointer')}>
                    {lines.map((contextLine: ClipSrtLine, index) =>
                        <span key={`${item.key}-${index}`}
                              onClick={() => {
                                  tender?.pin(contextLine);
                                  setPlayInfo({
                                      video: item,
                                      time: tender?.mapSeekTime(contextLine).start ?? contextLine.start,
                                      timeUpdated: Date.now()
                                  });
                                  // setPlay(true);
                                  console.log('setPlayInfo', contextLine.start);
                              }}
                              className={cn('hover:underline',
                                  contextLine === currentLine && 'text-primary',
                                  contextLine.isClip && 'font-bold'
                              )}>
                              {contextLine.contentEn}
                        </span>
                    )}
                </div>
                <div className="flex gap-2 items-start">
                    <div
                        className={cn('text-sm text-muted-foreground flex-1 w-0')}>{new Date(item.created_at).toLocaleString() + '     ' + item.video_name}</div>
                    <Button variant={'outline'} size={'icon'} className={'w-5 h-5 hover:bg-red-100'}
                            onClick={async () => {
                                deleteClip(item.key);
                            }}>
                        <Trash2 className={'w-3 h-3'} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FavouriteItem;
