import { Art } from "@/core";
class ArtHttpRequest {
    xhr: XMLHttpRequest;
    method: string;
    url: string;
    data: any;
    constructor(method: string, url: string) {
        this.xhr = new XMLHttpRequest();
        this.method = method;
        this.url = url;
    }

    public then(callback: Function): ArtHttpRequest {
        this.xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        }
        this.xhr.open(this.method, this.url, true);
        if (this.method == 'POST' && this.data != undefined) {
            this.xhr.setRequestHeader("Content-type","application/json");
            this.xhr.send(this.data);
        } else {
            this.xhr.send();
        }
        return this;
    }
}

export default class ArtRequest {
    rootUrl: string;
    constructor(rootUrl: string) {
        this.rootUrl = rootUrl;
    }

    public get(url: string): ArtHttpRequest {
        return new ArtHttpRequest('GET', this.rootUrl + url);
    }

    public post(url: string, data:any=undefined): ArtHttpRequest {
        let artHttpRequest = new ArtHttpRequest('POST', this.rootUrl + url);
        if (data == undefined) {
            artHttpRequest.data = data;
        } else {
            artHttpRequest.data = JSON.stringify(data);
        }
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