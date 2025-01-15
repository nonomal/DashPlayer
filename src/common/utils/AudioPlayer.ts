import UrlUtil from '@/common/utils/UrlUtil';
import StrUtil from '@/common/utils/str-util';
import { Nullable } from '@/common/types/Types';
import { TypeGuards } from '@/backend/utils/TypeGuards';

const cache = new Map<string, string>();
const api = window.electron;
let player: HTMLAudioElement | null = null;

async function getAudioUrl(outURl: string) {
    let audioUrl = cache.get(outURl);
    if (!audioUrl) {
        const data = await fetch(UrlUtil.dp(outURl));
        const blob = new Blob([await data.arrayBuffer()]);
        audioUrl = URL.createObjectURL(blob);
        cache.set(outURl, audioUrl);
    }
    return audioUrl;
}

export const playAudioUrl = async (audioUrl: Nullable<string>) => {
    if (TypeGuards.isNull(audioUrl)) {
        return;
    }
    player?.pause();
    console.log('playAudioUrl', audioUrl);
    player = new Audio(audioUrl);
    player.volume = 0.5;
    await player.play();
};

export const playUrl = async (outURl: string) => {
    const audioUrl = await getAudioUrl(outURl);
    console.log('testcall', outURl);
    await playAudioUrl(audioUrl);
};

export const playWord = async (word: string) => {
    let blobUrl = cache.get(word);
    if (blobUrl) {
        await playAudioUrl(blobUrl);
        return;
    }
    const trans = await api.call('ai-trans/word', word);
    const outUrl = trans?.speakUrl;
    if (StrUtil.isBlank(outUrl)) {
        return;
    }
    blobUrl = await getAudioUrl(outUrl);
    cache.set(word, blobUrl);
    await playAudioUrl(blobUrl);
};

export const getTtsUrl = async (str: string) => {
    str = str.trim();
    if (StrUtil.isBlank(str)) {
        return;
    }
    let audioUrl = cache.get(str);
    if (audioUrl) {
        return audioUrl;
    }
    // audioUrl = await api.aiTts(str);
    audioUrl = await api.call('ai-func/tts', str);
    console.log('testcall', audioUrl);
    if (!StrUtil.isBlank(audioUrl)) {
        cache.set(str, audioUrl);
    }
    return audioUrl;
};
