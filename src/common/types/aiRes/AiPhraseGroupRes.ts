export interface AiPhraseGroupRes {
    sentence: string;
    translation:string;
    phraseGroups: {
        original: string;
        translation: string;
        comment: string;
    }[];
}
