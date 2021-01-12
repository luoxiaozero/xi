import { win } from "@/config";
import Tool from "@/tool";
import ArtRender from "..";


export let loadPluginsExport = {
    install: function (Art, options) {
        options['Tool'].loadScript('https://libs.cdnjs.net/highlight.js/10.1.2/highlight.min.js', 
                                    () => { ArtRender.setPlugin('hljs', win['hljs']) });   

        options['Tool'].loadScript('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js', 
                                    () => { ArtRender.setPlugin('katex', win['katex']) });
        options['Tool'].loadCss('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css');
        

        let fun = () => { options['Tool'].loadScript('https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.14.0/flowchart.min.js', 
                    () => { ArtRender.setPlugin('flowchart', win['flowchart']) }) };
        options['Tool'].loadScript('https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js', 
        () => { ArtRender.setPlugin('Raphael', win['Raphael']); fun(); })
    }
}