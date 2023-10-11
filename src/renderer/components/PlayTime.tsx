import { Component } from 'react';

interface PlayTimeParam {
    textClassName: string;
    getProgress: () => number;
    getTotalTime: () => number;
}

interface PlayerTimeState {
    totalTime: string;
    progress: string;
}
export const secondToDate = (seconds = 0) => {
    if (seconds === undefined) {
        return '00:00:00';
    }
    const h: number = Math.floor((seconds / 60 / 60) % 24);
    const hs = h < 10 ? `0${h}` : h;
    const m = Math.floor((seconds / 60) % 60);
    const ms = m < 10 ? `0${m}` : m;
    const s = Math.floor(seconds % 60);
    const ss = s < 10 ? `0${s}` : s;
    return `${hs}:${ms}:${ss}`;
};
export default class PlayTime extends Component<
    PlayTimeParam,
    PlayerTimeState
> {
    private interval: NodeJS.Timer | undefined;

    constructor(props: PlayTimeParam | Readonly<PlayTimeParam>) {
        super(props);
        this.state = {
            totalTime: '',
            progress: '',
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.task, 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    private task = () => {
        const { getTotalTime, getProgress } = this.props;
        this.setState({
            totalTime: secondToDate(getTotalTime()),
            progress: secondToDate(getProgress()),
        });
    };


    render() {
        const { progress, totalTime } = this.state;
        const { textClassName } = this.props;
        return (
            <div className={textClassName}>
                <span className="rounded">{progress}</span>
                &nbsp;/&nbsp;
                <span className="rounded">{totalTime}</span>
            </div>
        );
    }
}
