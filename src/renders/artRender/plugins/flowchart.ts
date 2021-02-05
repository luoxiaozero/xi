import { win } from "@/config";
import ArtRender from "..";
import Cursor from "../cursor";

let flowchart = null;
function update(dom: HTMLElement, codeText: string) {
    try {
        let chart = flowchart.parse(codeText);
        chart.drawSVG(dom);
        (dom.previousSibling as HTMLPreElement).style.display = 'none';
        dom.onclick = function click() {
            console.log(this, (<HTMLDivElement>this).previousSibling);
            ((<HTMLDivElement>this).previousSibling as HTMLPreElement).style.display = 'inherit';
            Cursor.setCursor((<HTMLDivElement>this).previousSibling, 0);
        }
    } catch (error) {
        console.error('flowchart发生错误:', error);
    }
}


export let flowchartExport = {
    install(Art, options) {
        let fun = () => {
            options['Tool'].loadScript('https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.14.0/flowchart.min.js',
                () => { flowchart = win['flowchart']; ArtRender.setPlugin('flowchart', update); })
        };
        options['Tool'].loadScript('https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js',
            () => { fun(); })
    }
}