import ArtText from "./index";

function exportMdFile(content:string, filename:string){
    var ele = document.createElement('a');// 创建下载链接
    ele.download = filename;//设置下载的名称
    ele.style.display = 'none';// 隐藏的可下载链接
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    ele.href = URL.createObjectURL(blob);
    // 绑定点击时间
    document.body.appendChild(ele);
    ele.click();
    // 然后移除
    document.body.removeChild(ele);
}
function importMdFile(artText: ArtText){
    let ele = document.createElement('input');
    ele.type = 'file';
    ele.accept = '.md';
    ele.style.display = 'none';

    document.body.appendChild(ele);
    ele.click();
    ele.onchange = () => {
        const reader = new FileReader()
        reader.onload = ()=>{
            console.log(reader.result.toString())
            artText.editor.openFile(reader.result.toString(), ele.files[0].name);
            console.log(artText.editor.htmlNode)
        }
        reader.readAsText(ele.files[0],'utf8');
    }
    document.body.removeChild(ele);
}
function exportMdFileInit(artText: ArtText){
    function fun() {
        exportMdFile(artText.editor.getMd(), '123.md');
    }
    function fun1() {
        importMdFile(artText);
    }
    function closure(): Function{
        function c(){
            artText.tool.addTool('导入', fun1);
            artText.tool.addTool('导出', fun);
        }
        return c;
    }
    artText.eventCenter.addFutureEvent('-end-init', closure());
}
export let exportMdFileMap = {plugin: exportMdFile, options: {name: 'exportMdFile', init: exportMdFileInit}}