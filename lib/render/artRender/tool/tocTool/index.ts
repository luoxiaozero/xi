import Tool from 'lib/tool'
export default function initTocTool(root: HTMLElement): void{
    root.innerHTML = '';
    root.style.width = "100%"
    root.style.fontSize = "14px"
    root.style.position = "relative";
    root.style.visibility = 'hidden';

    let span = document.createElement("span");
    span.style.fontWeight = '600'
    span.innerHTML = '目录'

    let delSpan = document.createElement('button');
    delSpan.setAttribute('class', 'art-buttonTool-hover');
    delSpan.innerHTML = '<svg class="icon" style="width: 18px; height: 18px;color: red;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="689"><path d="M800.162002 316.659033c1.850138-17.575284 17.596773-30.322609 35.172058-28.473495 17.575284 1.850138 30.322609 17.596773 28.473494 35.172058l-57.966202 550.673811c-5.143137 48.856731-46.341445 85.946464-95.467306 85.946464H313.625954c-49.126884 0-90.325192-37.089733-95.468329-85.946464L160.192446 323.358619c-1.850138-17.575284 10.898211-33.32192 28.472471-35.172057 17.575284-1.850138 33.32192 10.898211 35.172058 28.473494l57.965179 550.672788c1.714038 16.285918 15.446807 28.64848 31.822776 28.648481h396.74707c16.375969 0 30.108738-12.363585 31.822776-28.648481l57.967226-550.673811z m-192.176904 99.345636c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-191.990662 0c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-31.998785-223.989447h255.987209v-47.998178c0-8.836249-7.163143-15.999392-15.999393-15.999392H399.995043c-8.836249 0-15.999392 7.163143-15.999392 15.999392v47.998178z m-63.996546 0V128.018675c0-35.344996 28.652574-63.996546 63.997569-63.996546h255.987209c35.343973 0 63.996546 28.652574 63.996546 63.996546v63.996547h223.99968c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998784H96.019891c-17.672498 0-31.998785-14.326287-31.998785-31.998784s14.326287-31.998785 31.998785-31.998785h223.979214z" p-id="690"></path></svg>'; 
    delSpan.title = '删除目录'; 
    delSpan.style.position = 'absolute';
    delSpan.style.right = '0';
    delSpan.style.top = '-2px';
    delSpan.onclick = delTOC;

    root.appendChild(span);
    root.appendChild(delSpan);
}
function delTOC(e: MouseEvent){
    let div = (<HTMLSpanElement>e.target).parentNode.parentNode; // HTMLSVGElement
    if(div.nextSibling && Tool.hasClass(div.nextSibling as HTMLDivElement, 'art-toc')){
        div.parentNode.removeChild(div.nextSibling);
        div.parentNode.removeChild(div);
    }
}