import { win } from "../../../config";
import ArtRender from "..";
import Cursor from "../cursor";

let mermaid = null;
function create_ID(): string {
    let timestamp = (new Date()).valueOf();
    return "mermaid-" + timestamp;
}
function update(dom: HTMLElement, mdText: string) {
    // Example of using the API
    let id_str = create_ID();
    let element = document.createElement("div");
    element.setAttribute("id", id_str);
    dom.appendChild(element);
    function insertSvg(svgCode, bindFunctions) {
        dom.innerHTML = svgCode;
        (dom.previousSibling as HTMLPreElement).style.display = 'none';
        dom.onclick = function click() {
            console.log(this, (<HTMLDivElement>this).previousSibling);
            ((<HTMLDivElement>this).previousSibling as HTMLPreElement).style.display = 'inherit';
            Cursor.setCursor((<HTMLDivElement>this).previousSibling, 0);
        }
    }

    mermaid.mermaidAPI.render(id_str, mdText, insertSvg);
}


export let mermaidExport = {
    install(Art, options) {
        options['Tool'].loadScript("https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js",
            () => {
                mermaid = win["mermaid"]; 
                mermaid.mermaidAPI.initialize({
                    startOnLoad: false
                });
                ArtRender.setPlugin("mermaid", update); 
            });
    }
}