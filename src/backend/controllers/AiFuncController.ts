import TtsService from '@/backend/services/TtsService';
import registerRoute from '@/common/api/register';
import AiServiceImpl from '@/backend/services/AiServiceImpl';
import ChatServiceImpl from '@/backend/services/impl/ChatServiceImpl';
import { MsgT, toLangChainMsg } from '@/common/types/msg/interfaces/MsgT';
import UrlUtil from '@/common/utils/UrlUtil';
import { inject, injectable } from 'inversify';
import Controller from '@/backend/interfaces/controller';
import TYPES from '@/backend/ioc/types';
import DpTaskService from '@/backend/services/DpTaskService';
import WhisperService from '@/backend/services/WhisperService';

@injectable()
export default class AiFuncController implements Controller {

    @inject(TYPES.DpTaskService)
    private dpTaskService!: DpTaskService;

    @inject(TYPES.ChatService)
    private chatService!: ChatServiceImpl

    @inject(TYPES.AiService)
    private aiService!: AiServiceImpl

    @inject(TYPES.WhisperService)
    private whisperService!: WhisperService;

    public async analyzeNewWords(sentence: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.analyzeWord(taskId, sentence).then();
        return taskId;
    }

    public async analyzeNewPhrases(sentence: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.analyzePhrase(taskId, sentence).then();
        return taskId;
    }

    public async analyzeGrammars(sentence: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.analyzeGrammar(taskId, sentence).then();
        return taskId;
    }

    public async makeSentences({ sentence, point }: { sentence: string, point: string[] }) {
        const taskId = await this.dpTaskService.create();
        this.aiService.makeSentences(taskId, sentence, point).then();
        return taskId;
    }

    public async polish(sentence: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.polish(taskId, sentence).then();
        return taskId;
    }

    public async formatSplit(text: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.formatSplit(taskId, text).then();
        return taskId;
    }

    public async phraseGroup(sentence: string) {
        const taskId = await this.dpTaskService.create();
        this.aiService.phraseGroup(taskId, sentence).then();
        return taskId;
    }

    public async punctuation({ no, srt }: { no: number, srt: string }) {
        const taskId = await this.dpTaskService.create();
        this.aiService.punctuation(taskId, no, srt).then();
        return taskId;
    }

    public async translateWithContext({ sentence, context }: { sentence: string, context: string[] }) {
        const taskId = await this.dpTaskService.create();
        this.aiService.translateWithContext(taskId, sentence, context).then();
        return taskId;
    }

    public async tts(string: string) {
        return UrlUtil.dp(await TtsService.tts(string));
    }

    public async chat({ msgs }: { msgs: MsgT[] }): Promise<number> {
        const taskId = await this.dpTaskService.create();
        const ms = msgs.map((msg) => toLangChainMsg(msg));
        this.chatService.chat(taskId, ms).then();
        return taskId;
    }

    public async transcript({ filePath }: { filePath: string }) {
        const taskId = await this.dpTaskService.create();
        console.log('taskId', taskId);
        this.whisperService.transcript(taskId, filePath).then(r => {
            console.log(r);
        });
        return taskId;
    }

    public async explainSelectWithContext({ sentence, selectedWord }: { sentence: string, selectedWord: string }) {
        const taskId = await this.dpTaskService.create();
        this.aiService.explainSelectWithContext(taskId, sentence, selectedWord).then();
        return taskId;
    }

    public async explainSelect({ word }: { word: string }) {
        const taskId = await this.dpTaskService.create();
        this.aiService.explainSelect(taskId, word).then();
        return taskId;
    }

    registerRoutes(): void {
        registerRoute('ai-func/analyze-new-words', (p) => this.analyzeNewWords(p));
        registerRoute('ai-func/analyze-new-phrases', (p) => this.analyzeNewPhrases(p));
        registerRoute('ai-func/analyze-grammars', (p) => this.analyzeGrammars(p));
        registerRoute('ai-func/make-example-sentences', (p) => this.makeSentences(p));
        registerRoute('ai-func/punctuation', (p) => this.punctuation(p));
        registerRoute('ai-func/polish', (p) => this.polish(p));
        registerRoute('ai-func/format-split', (p) => this.formatSplit(p));
        registerRoute('ai-func/phrase-group', (p) => this.phraseGroup(p));
        registerRoute('ai-func/tts', (p) => this.tts(p));
        registerRoute('ai-func/chat', (p) => this.chat(p));
        registerRoute('ai-func/transcript', (p) => this.transcript(p));
        registerRoute('ai-func/explain-select-with-context', (p) => this.explainSelectWithContext(p));
        registerRoute('ai-func/explain-select', (p) => this.explainSelect(p));
        registerRoute('ai-func/translate-with-context', (p) => this.translateWithContext(p));
    }
}

