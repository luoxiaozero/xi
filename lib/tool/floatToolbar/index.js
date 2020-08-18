export default function floatToolbar(){
    //dom.getBoundingClientRect()

    let box = document.createElement('div');
    box.style.width = '180px'
    box.style.position = 'absolute';
    box.style.top = '10px';
    box.style.left =  '10px';
    box.style.background = 'rgba(255,255,255,.89)';
    //box.style.backgroundColor = '#fff'
    box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
    box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
    box.style.border ='1px solid #e6e6e6';
    // box.style.display = 'none';

    
    let ul = document.createElement('ul');
    ul.setAttribute('style', 'list-style:none;margin:0;padding:5px 0;')
    ul.innerHTML = '<li>123</li><li>123</li><li>123</li>'
    let li = document.createElement('li');
    ul.appendChild(li);
    box.appendChild(ul);

    return box;
}