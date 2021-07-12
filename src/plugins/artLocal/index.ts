import { Art } from '../../core';
import EventCenter from '../../eventCenter';
import Editor from '../../editor';
import ArtRequest from '../../plugins/artRequest';
import Message from '../../plugins/message';

class ArtLocal {
    art: Art
    constructor(art: Art) {
        this.art = art;
        this.art.get<EventCenter>('$eventCenter').on('art-save', () => this.save());
        this.art.get<EventCenter>("$eventCenter").on("art-uploadImage", (data) => this.uploadImage(data[0], data[1]));
    }

    public save() {
        let fileInfo = this.art.get<Editor>('$editor').getFile();
        console.log(fileInfo)
        let data = { markdown: fileInfo.markdown, path: fileInfo.path };
        console.log(data)
        this.art.get<ArtRequest>('artRequest').post('/saveFileText', data).then((response) => {
            if (response.StatusCode == 200) this.art.get<Message>('message').create('提交成功', 'success')
        })
    }

    uploadImage(file: File, closure) {
        let fileInfo: any = this.art.get<Editor>("$editor").fileInfo;
        let formData = new FormData();
        formData.append("image", file);

        let path = "";
        if (fileInfo.path != undefined)
            path = fileInfo.path;
        formData.append("path", path);
        this.art.get<ArtRequest>('artRequest').post('/uploadImage', formData,
            false).then((json) => {

                this.art.get<Message>('message').create('提交成功', 'success');
                closure(json.url, json.name);

            })


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