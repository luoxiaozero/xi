import { win } from "../../../config";
import ArtRender from "..";

let katex = null;
function update(dom: HTMLElement, mdText: string) {
    dom.innerHTML = katex.renderToString(mdText, { throwOnError: false });
}


export let katexExport = {
    install(Art, options) {
        
            options['Tool'].loadScript('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js',
                () => { katex = win['katex']; ArtRender.setPlugin('katex', update) });
            options['Tool'].loadCss('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css');
        
    }
}