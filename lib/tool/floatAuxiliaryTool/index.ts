export default function floatAuxiliary(): HTMLDivElement{
    //dom.getBoundingClientRect()

    let box = document.createElement('div');
    box.style.width = '200px'
    box.style.position = 'absolute';
    box.style.top = '10px';
    box.style.left =  '10px';
    box.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
    box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
    box.style.border = '1px solid #d1d1d1';
    box.style.borderRadius = '2px';
    box.style.display = 'none';


    let ul = document.createElement('ul');
    ul.setAttribute('style', 'list-style:none;margin:0;padding:4px 0;font-size: 13px;font-weight: 500;')

    let li = document.createElement('li');
    li.setAttribute('class', 'art-floatAuxiliaryTool-li')
    li.setAttribute('style', 'padding: 3px 20px;margin:3px 0; cursor: pointer;');
    li.innerHTML = '使用百度搜索'

    ul.appendChild(li);
    let hr = document.createElement('hr');
    hr.style.height = '0';
    hr.style.marginBottom = '0';
    ul.appendChild(hr);

    li = document.createElement('li');
    li.setAttribute('class', 'art-floatAuxiliaryTool-li')
    li.setAttribute('style', 'padding: 3px 20px;margin:3px 0; cursor: pointer;');
    li.innerText = '剪切'
    ul.appendChild(li);

    li = document.createElement('li');
    li.setAttribute('class', 'art-floatAuxiliaryTool-li')
    li.setAttribute('style', 'padding: 3px 20px;margin:3px 0; cursor: pointer;');
    li.innerText = '复制'

    ul.appendChild(li);

    li = document.createElement('li');
    li.setAttribute('class', 'art-floatAuxiliaryTool-li');
    li.setAttribute('style', 'padding: 3px 20px;margin:3px 0; cursor: pointer;');
    li.innerText = '粘贴'

    ul.appendChild(li);

    box.appendChild(ul);

    return box;
}