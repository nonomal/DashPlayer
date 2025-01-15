import React from 'react';
import { cn } from '@/fronted/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/fronted/components/ui/card';
import Playable from '@/fronted/components/chat/Playable';
import useChatPanel from '@/fronted/hooks/useChatPanel';
import { Button } from '@/fronted/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/fronted/components/ui/skeleton';
import useDpTaskViewer from '@/fronted/hooks/useDpTaskViewer';
import { AiAnalyseNewWordsRes } from '@/common/types/aiRes/AiAnalyseNewWordsRes';

const ChatLeftWords = ({ className }: {
    className: string,
}) => {
    const tid = useChatPanel(state => state.tasks.vocabularyTask);

    const { detail } = useDpTaskViewer<AiAnalyseNewWordsRes>(typeof tid === 'number' ? tid : null);
    const retry = useChatPanel(state => state.retry);
    console.log('detail', detail);
    return (

        <div className={cn('flex flex-col', className)}>
            <Card className={'shadow-none relative'}>
                <CardHeader>
                    <CardTitle>本句生词</CardTitle>
                    <Button variant={'ghost'} size={'icon'} onClick={() => retry('vocabulary')}
                            className={'absolute right-2 top-2 w-8 h-8 text-gray-400 dark:text-gray-200'}>
                        <RefreshCcw className={'w-3 h-3'} />
                    </Button>
                    {/*<CardDescription>分析本句中的生词</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    {detail?.hasNewWord && detail?.words?.map((word, i) => (
                        <div key={i} className="flex flex-col items-start px-4 py-2">
                            <div className="flex items-center flex-wrap gap-2 text-md text-lg">
                                <Playable className={cn('')}>{word.word}</Playable>
                                <div className={cn('text-base')}>{word.meaning}</div>
                                <div className={cn(
                                    'p-0.5 text-xs text-red-900 border border-red-500 bg-red-50 rounded-md drop-shadow shadow-inner',
                                    'dark:text-red-100 dark:border-red-700 dark:bg-red-700 dark:shadow-inner'
                                )}>
                                    {word.phonetic}
                                </div>
                            </div>
                        </div>
                    ))}
                    {!detail && <><Skeleton className={'h-6'} /><Skeleton className={'h-6 mt-2'} /><Skeleton
                        className={'h-6 mt-2'} /></>}
                    {detail && !detail.hasNewWord && <div className="text-lg text-gray-700">没有生词</div>}
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatLeftWords;
