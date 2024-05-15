import {cn} from "@/fronted/lib/utils";
import usePlayerController from "@/fronted/hooks/usePlayerController";
import SentenceC from "@/common/types/SentenceC";
import ViewerTranslableLine from "@/fronted/components/subtitle-viewer/viewer-translable-line";
import {strBlank} from "@/common/utils/Util";
import ViewerControlPannel from "@/fronted/components/subtitle-viewer/viewer-control-pannel";
import { useShallow } from 'zustand/react/shallow';

const SubtitleViewer = ({className}: { className?: string }) => {
    const current: SentenceC = usePlayerController((s) => s.currentSentence);
    const subtitleAround: SentenceC[] = usePlayerController.getState().getSubtitleAround(current?.index ?? 0);
    const subtitleBefore: SentenceC[] = subtitleAround.filter((s) => s.index < current.index).sort((a, b) => b.index - a.index);
    const subtitleAfter: SentenceC[] = subtitleAround.filter((s) => s.index > current.index).sort((a, b) => a.index - b.index)

    const showCn = usePlayerController(s=>s.showCn);
    const { adjusted, clearAdjust } = usePlayerController(useShallow(s=>({
        adjusted: s.currentSentence.originalBegin != null || s.currentSentence.originalEnd != null,
        clearAdjust: s.clearAdjust
    })));
    return (
        <div
            className={cn('w-full h-full relative overflow-hidden rounded-none bg-stone-100 dark:bg-neutral-800', className)}
        >
            <div className={cn('w-full h-full overflow-hidden grid grid-cols-1 bg-stone-100 dark:bg-neutral-800')}
                 style={{
                     gridTemplateRows: '15% 15% 55% 15%'
                 }}
            >
                <div
                    className={cn('row-start-1 row-end-3 col-start-1 col-end-2 flex flex-col-reverse items-center justify-start gap-10 text-foreground/50 overflow-hidden pb-8')}>
                    {
                        subtitleBefore.map((s) => (
                            <ViewerTranslableLine
                                adjusted={false} clearAdjust={() => {
                            }}
                                key={s.key} className={cn('text-3xl')}
                                sentence={s}
                            />
                        ))
                    }
                </div>
                <div
                    className={cn('row-start-3 row-end-5 col-start-1 col-end-2 flex flex-col items-center justify-start gap-10 overflow-hidden')}
                >

                    <div
                        className={cn('py-20 w-full flex flex-col items-center justify-center gap-10',
                            'bg-stone-50 dark:bg-neutral-700 text-foreground/80 border-8 rounded-2xl border-stone-100 dark:border-neutral-800'
                        )}
                    >
                        <ViewerTranslableLine
                            className={cn('text-4xl')}
                            adjusted={adjusted} clearAdjust={clearAdjust}
                            sentence={current}
                        />
                        {!strBlank(current?.msTranslate) && showCn && <div className={cn('text-3xl')}>
                            {current?.msTranslate}
                        </div>}
                        {!strBlank(current?.textZH) && showCn && <div className={cn('text-2xl')}>
                            {current?.textZH}
                        </div>}
                    </div>
                    {
                        subtitleAfter.map((s) => (
                            <ViewerTranslableLine
                                sentence={s}
                                adjusted={false} clearAdjust={() => {
                            }}
                                key={s.key} className={cn('text-3xl text-foreground/75')} />

                        ))
                    }
                </div>
                <div className={cn('w-full row-start-1 row-end-2 col-start-1 col-end-2',
                    'bg-gradient-to-t from-transparent to-stone-100 dark:from-transparent dark:to-neutral-800'
                )}></div>
                <div className={cn('w-full row-start-4 row-end-5 col-start-1 col-end-2',
                    'bg-gradient-to-b from-transparent to-stone-100 dark:from-transparent dark:to-neutral-800'
                )}></div>
            </div>
            <ViewerControlPannel

                className={'absolute left-0 bottom-0'} />
            {/* </CardContent> */}
        </div>
    );

}
export default SubtitleViewer;

SubtitleViewer.defaultProps = {
    className: ''
}
