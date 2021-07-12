import { win } from "../../../config";
import ArtRender from "..";

let hljs = null;
function update(dom: HTMLElement, mdText: string, lang: string) {
    if (lang && hljs.getLanguage(lang) != undefined) {
        mdText = hljs.highlight(lang, mdText).value;
    } else {
        let codeHljs = hljs.highlightAuto(mdText);
        mdText = codeHljs.value;
        if (!dom.className.match(codeHljs.language))
            dom.className += ' ' + codeHljs.language;
    }
    dom.innerHTML = mdText;
}


export let hljsExport = {
    install(Art, options) {
        options['Tool'].loadScript("https://libs.cdnjs.net/highlight.js/10.1.2/highlight.min.js",
            () => { hljs = win["hljs"]; ArtRender.setPlugin("hljs", update); })

    }
}