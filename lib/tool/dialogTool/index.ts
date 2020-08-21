function dialogTool(): HTMLDivElement{
    let root = document.createElement("div");
    root.style.position = 'fixed';
    root.style.zIndex = '10';
    root.style.width = '50%';
    root.style.top = '6vh';
    root.style.backgroundColor = '#fff';
    root.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
    root.style.borderRadius = '2px';

    let dialog_header = document.createElement('div');
    dialog_header.style.padding = '15px 20px 8px';
    dialog_header.style.borderBottom = '1px solid #eee';
    dialog_header.innerHTML = 'md'


    let dialog_body = document.createElement('div');
    dialog_body.style.height = '450px';
    dialog_body.style.overflow = 'auto';
    dialog_body.style.padding = '5px 13px';
    let dialog_footer = document.createElement('div');
    dialog_footer.style.padding = '15px 20px 8px';
    let span = document.createElement('span');
    span.style.cursor = 'pointer';
    span.innerHTML = '关闭';
    function closure(){
        () => {root.style.display = 'none';}
    }
    span.onclick = closure;;
    dialog_footer.appendChild(span);

    root.appendChild(dialog_header);
    root.appendChild(dialog_body);
    root.appendChild(dialog_footer);
    root.style.display = 'none';
    return root;
}
export {dialogTool}