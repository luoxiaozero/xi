export default function floatToolbar(): HTMLDivElement{
    //dom.getBoundingClientRect()

    let box = document.createElement('div');
    box.style.width = '180px'
    box.style.position = 'absolute';
    box.style.top = '10px';
    box.style.left =  '10px';
    box.style.fontWeight = '800';
    box.style.fontSize = '17px';
    box.style.padding = '3px 8px';
    box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
    box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
    box.style.border ='1px solid #e6e6e6';
    box.style.display = 'none';
    // box.style.display = 'none';

    
    let span = document.createElement('span');
    span.setAttribute('class', 'art-floatToolbar-span')
    span.innerText = 'B';
    box.appendChild(span);

    span = document.createElement('span');
    span.setAttribute('class', 'art-floatToolbar-span')
    span.innerText = 'I';
    box.appendChild(span);

    return box;
}