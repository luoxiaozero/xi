import { Art } from "@/core";
class ArtHttpRequest {
    xhr: XMLHttpRequest;
    method: string;
    url: string;

    public then(callback: Function): ArtHttpRequest {
        this.xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        }
        this.xhr.open(this.method, this.url, true);
        this.xhr.send();
        return this;
    }
}

export default class ArtRequest {
    rootUrl: string;
    constructor(rootUrl: string) {
        this.rootUrl = rootUrl;
    }

    public get(url: string): ArtHttpRequest {
        let artHttpRequest = new ArtHttpRequest();
        artHttpRequest.xhr = new XMLHttpRequest();
        artHttpRequest.method = 'GET';
        artHttpRequest.url = this.rootUrl + url;
        return artHttpRequest;
    }

    public post(url: string): ArtHttpRequest {
        let artHttpRequest = new ArtHttpRequest();
        artHttpRequest.xhr = new XMLHttpRequest();
        artHttpRequest.method = 'POST';
        artHttpRequest.url = this.rootUrl + url;
        return artHttpRequest;
    }
}

export let ArtRequestExport = {
    install(Art: Art, options) {
        options['container'].bind('artRequest', ArtRequest, ['http://127.0.0.1:8000/api']);
    },
    created(art: Art, options) {
        art.get<ArtRequest>('artRequest').get('/test').then((json: any) => {console.log(json)})
    }
}