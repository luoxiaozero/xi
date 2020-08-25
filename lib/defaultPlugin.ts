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
function exportMdFileInit(artText: ArtText){
    function fun() {
        exportMdFile(artText.editor.getMd(), '123.md');
    }
    function closure(): Function{
        function c(){
            artText.tool.addTool('导出md', fun);
        }
        return c;
    }
    artText.eventCenter.addFutureEvent('init-end', closure());
}
export let exportMdFileMap: Map<any, any> = new Map();
exportMdFileMap.set('plugin', exportMdFile);
exportMdFileMap.set('options', {'name': 'exportMdFile', 'init': exportMdFileInit});