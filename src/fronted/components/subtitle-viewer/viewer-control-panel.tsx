import React, { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import VolumeSlider from '../VolumeSlider';
import usePlayerController from '../../hooks/usePlayerController';
import {cn} from "@/fronted/lib/utils";
import SpeedSlider from '../speed-slider';
import { Slider } from '@/fronted/components/ui/slider';
import { Card } from '@/fronted/components/ui/card';
import {Pause, Play} from "lucide-react";
import {Button} from "@/fronted/components/ui/button";
import TimeUtil from "@/common/utils/TimeUtil";

export interface PlayerControlPanelProps {
    className?: string;

}

const ViewerControlPanel = ({
                                 className
                             }: PlayerControlPanelProps) => {
    const {
        playTime,
        duration,
        volume,
        setVolume,
        playbackRate,
        setPlaybackRate,
        muted,
        setMuted,
        onPlay,
        onPause,
        playing,
        onTimeChange,
        changeAutoPause,
        changeSingleRepeat
    } = usePlayerController(
        useShallow((s) => ({
            playTime: s.playTime,
            duration: s.duration,
            volume: s.volume,
            setVolume: s.setVolume,
            playbackRate: s.playbackRate,
            setPlaybackRate: s.setPlaybackRate,
            setMuted: s.setMuted,
            muted: s.muted,
            onPlay: s.play,
            onPause: s.pause,
            playing: s.playing,
            onTimeChange: s.seekTo,
            changeAutoPause: s.changeAutoPause,
            changeSingleRepeat: s.changeSingleRepeat
        }))
    );
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState(0);
    const currentValueUpdateTime = useRef<number>(0);
    const [selecting, setSelecting] = useState(false);

    // const currentValueUpdateTime
    useEffect(() => {
        if (selecting || Date.now() - currentValueUpdateTime.current < 500) {
            return;
        }
        setCurrentValue(playTime);
    }, [playTime, duration, selecting]);


    return (
        <div className={cn(' h-32 flex w-full flex-col justify-end', className)}>

            <Card
                className={cn('w-full p-4 pt-6 backdrop-blur bg-gray-500/20 rounded-none border-0 border-t shadow-2xl',
                    !mouseOver && 'bg-transparent border-none backdrop-blur-0 shadow-none'
                )}
                onMouseOver={(e) => {
                    setMouseOver(true);
                }}
                onMouseLeave={() => {
                    setMouseOver(false);
                }}
            >
                <div
                    className={cn(
                        'flex flex-col items-center justify-between w-full gap-4',
                        !mouseOver && 'invisible'
                    )}
                >

                    <Slider
                        className=""
                        max={duration}
                        min={0}
                        value={[currentValue]}
                        onValueChange={(value) => {
                            console.log('onValueChange   fff', value);
                            setCurrentValue(value[0]);
                            setSelecting(true);
                            onTimeChange?.({time: value[0]});
                            changeAutoPause(false);
                            changeSingleRepeat(false);
                        }}
                        onValueCommit={(value) => {
                            currentValueUpdateTime.current = Date.now();
                            // onTimeChange?.({time: value[0]});
                            setSelecting(false);
                        }}
                    />
                    <div className="w-full flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <Button
                                onClick={() => {
                                    if (playing) {
                                        onPause?.();
                                    } else {
                                        onPlay?.();
                                    }
                                }}
                                size={'icon'}
                                variant={'ghost'}
                                className={'w-9 h-9'}
                            >
                                {playing ? (
                                    <Pause className="" />
                                ) : (
                                    <Play className="" />
                                )}
                            </Button>
                            <div className=" h-full flex items-center font-mono">
                                {`${TimeUtil.secondToTimeStr(
                                    currentValue
                                )} / ${TimeUtil.secondToTimeStr(duration)}`}
                            </div>
                        </div>
                        <div className="h-full flex-1" />
                        <div className="flex justify-center items-end gap-4">
                            {/* <FullscreenButton fullScreen={fullScreen} changeFullScreen={changeFullScreen} /> */}
                            <SpeedSlider
                                speed={playbackRate}
                                onSpeedChange={setPlaybackRate}
                            />
                            <VolumeSlider
                                muted={muted}
                                onMutedChange={setMuted}
                                volume={volume}
                                onVolumeChange={setVolume}
                            />
                        </div>
                    </div>

                </div>
            </Card>
        </div>

    );
};
ViewerControlPanel.defaultProps = {
    className: '',
    onTimeChange: () => {
        //
    },
    onPause: () => {
        //
    },
    onPlay: () => {
        //
    },
    playing: false
};

export default ViewerControlPanel;
