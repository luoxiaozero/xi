import Tool from "..";

function toolbarTool(theme: {}): HTMLDivElement{
    let root = document.createElement("div"); 
    root.style.marginBottom = '25px';
    root.style.padding = '13px 12px';
    root.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
    root.style.backgroundColor = theme['backgroundColor'];
    root.setAttribute('class', 'art-toolbar');
    Tool.addCss('.art-toolbar{color: #666; font-weight:600; font-size:13.5px; border-radius: 4px; position: relative;}');
    return root;
}
export {toolbarTool};