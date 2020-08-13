export default function codeTool(){
    let root = document.createElement("div"); 
    root.style.width = "100%"
    // root.style.height = "40px"
    root.className = "art-codeTool art-shield"
    root.style.fontSize = "14px"
    root.style.position = "relative";
    root.setAttribute("contenteditable", "false");
    
    let span = document.createElement('span');
    span.innerHTML = '<svg class="icon" style="width: 18px; height: 18px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="714"><path d="M288.010553 735.989447h383.981325c17.672498 0 31.998785 14.326287 31.998784 31.998785s-14.326287 31.998785-31.998784 31.998785H288.010553c-17.672498 0-31.998785-14.326287-31.998785-31.998785s14.326287-31.998785 31.998785-31.998785z m0-159.992901h191.990662c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998785H288.010553c-17.672498 0-31.998785-14.326287-31.998785-31.998785s14.326287-31.998785 31.998785-31.998785zM636.111692 92.137467l231.753272 231.753271a95.994308 95.994308 0 0 1 28.116361 67.87897v472.212832c0 53.016471-42.97886 95.995331-95.995332 95.995331H224.014007c-53.016471 0-95.995331-42.97886-95.995332-95.995331V160.016437c0-53.016471 42.97886-95.995331 95.995332-95.995331h344.218715c25.459858 0 49.875944 10.114358 67.87897 28.116361z m-28.116361 62.388932v197.4807h197.4807L607.995331 154.526399z m-53.016471-26.507724H224.014007c-17.672498 0-31.998785 14.326287-31.998785 31.998785v703.966103c0 17.672498 14.326287 31.998785 31.998785 31.998785h575.971986c17.672498 0 31.998785-14.326287 31.998785-31.998785V405.024593v10.980076H607.995331c-35.344996 0-63.996546-28.652574-63.996546-63.996547V128.018675h10.980075z" p-id="715"></path></svg>'
    span.onclick = modifyLang;
    span.style.cursor = "pointer";

    let langInput = document.createElement("input");
    langInput.style.width = "80px";
    langInput.style.height = "20px";
    langInput.style.marginLeft = "7px"
    langInput.title = '代码语言';
    langInput.style.display = "none";

    let box = document.createElement('span');
    box.appendChild(span);
    box.appendChild(langInput);
    root.appendChild(box);
    //root.parentNode.nextSibling
    return root;
}
function getCodeLang(preDom){
    let lang = "";
    let className = preDom.childNodes[0].className;
    lang  = className.substring(5).split(' ')[0];
    return lang;
}
function setCodeLang(preDom, lang){
    preDom.childNodes[0].className = 'lang-' + lang;
}
function modifyLang(e){
    console.log(e, this)
    if(e.path[3].parentNode == window.artText.container.childNodes[0] && e.path[2].childNodes[1].nodeName == "INPUT"){
        if(e.path[2].childNodes[1].style.display === "none"){
            e.path[2].childNodes[1].style.display = "inline";
            let value = getCodeLang(e.path[3].nextSibling);
            e.path[2].childNodes[1].value = value;
        }else{
            setCodeLang(e.path[3].nextSibling, e.path[2].childNodes[1].value);
            e.path[2].childNodes[1].style.display = "none";
        }
    }
}