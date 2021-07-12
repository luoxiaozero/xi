import { Art } from "../../core";
declare class ArtHttpRequest {
    xhr: XMLHttpRequest;
    method: string;
    url: string;
    data: any;
    headers: any;
    contentType: any;
    constructor(method: string, url: string);
    then(callback: Function): ArtHttpRequest;
}
export default class ArtRequest {
    rootUrl: string;
    constructor(rootUrl: string);
    get(url: string): ArtHttpRequest;
    post(url: string, data?: any, contentType?: boolean): ArtHttpRequest;
}
export declare let ArtRequestExport: {
    install(Art: Art, options: any): void;
    created(art: Art, options: any): void;
};
export {};
