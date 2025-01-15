import Controller from '@/backend/interfaces/controller';
import { inject, injectable } from 'inversify';
import TYPES from '@/backend/ioc/types';
import TagService from '@/backend/services/TagService';
import registerRoute from '@/common/api/register';
import { Tag } from '@/backend/db/tables/tag';
import { FavouriteClipsService } from '@/backend/services/FavouriteClipsService';

@injectable()
export default class TagController implements Controller {
    @inject(TYPES.TagService) private tagService!: TagService;
    @inject(TYPES.FavouriteClips) private favouriteClipsService!: FavouriteClipsService;

    public async addTag(name: string): Promise<Tag> {
        return this.tagService.addTag(name);
    }

    public async deleteTag(id: number): Promise<void> {
        return this.tagService.deleteTag(id);
    }

    public async updateTag({ id, name }: { id: number, name: string }) {
        return this.favouriteClipsService.renameTag(id, name);
    }

    public async search(keyword: string): Promise<Tag[]> {
        return this.tagService.search(keyword);
    }

    registerRoutes(): void {
        registerRoute('tag/add', (p) => this.addTag(p));
        registerRoute('tag/delete', (p) => this.deleteTag(p));
        registerRoute('tag/update', (p) => this.updateTag(p));
        registerRoute('tag/search', (p) => this.search(p));
    }

}
