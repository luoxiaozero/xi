import { Art } from '../../src/core';
import EventCenter from '../../src/eventCenter';
import Editor from '../../src/editor';
import ArtRequest from 'plugins/artRequest';
import Message from '@/plugins/message';

class ArtLocal {
    art: Art
    constructor(art: Art) {
        this.art = art;
        this.art.get<EventCenter>('$eventCenter').on('art-save', () => this.save());
    }

    public save() {
        let fileInfo = this.art.get<Editor>('$editor').getFile();
        console.log(fileInfo)
        let data = { markdown: fileInfo.markdown, path: fileInfo.path };
        console.log(data)
        this.art.get<ArtRequest>('artRequest').post('/saveFileText', data).then((response) => {
            if(response.StatusCode == 200)this.art.get<Message>('message').create('提交成功', 'success')})
    }
}

export let ArtLocalExport = {

    install(Art: Art, options) {
        options['container'].bind('artLocal', ArtLocal, [{ 'get': 'art' }], true);
    },
    created(art: Art, options) {
        art.get<ArtLocal>('artLocal');
    }

}