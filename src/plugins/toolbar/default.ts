import { Art } from "@/core";
import Editor from "@/editor";
import { _Object_ } from "@/pluginCenter";
import Toolbar from "@/pluginCenter/plugins/toolbar";

export let exportMdFile = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({
            title: '导出', click: () => {
                {
                    let fileInfo = this._object_.getFile();
                    let filename = 'arttext';
                    if (fileInfo.name) {
                        filename = fileInfo.name;
                    }
                    let ele = document.createElement('a');
                    ele.download = filename + '.md';
                    ele.style.display = 'none';
                    // 字符内容转变成blob地址
                    let blob = new Blob([fileInfo.markdown]);
                    ele.href = URL.createObjectURL(blob);

                    document.body.appendChild(ele);
                    ele.click();
                    document.body.removeChild(ele);
                }
            }
        })
    }
}

export let importMdFile = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({
            title: '导入', click: () => {
                {
                    let ele = document.createElement('input');
                    ele.type = 'file';
                    ele.accept = '.md';
                    ele.style.display = 'none';

                    document.body.appendChild(ele);
                    ele.click();

                    let _object_ = this._object_;
                    ele.onchange = () => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            _object_.openFile({ name: ele.files[0].name.replace(/.md$/, ''), defaultMd: reader.result.toString() });
                        }
                        reader.readAsText(ele.files[0], 'utf8');
                    }
                    document.body.removeChild(ele);
                }
            }
        })
    }
}

export let newMdFileExport = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add({ title: '新建', click: () => art.get<Editor>('$editor').openFile() })
    }
}

export let GithubExport = {
    created: function (art: Art, options) {
        art.get<Toolbar>('toolbar').add(
            {
                title: '<span title="项目地址">Github</span>',
                click: () => window.open('https://github.com/liziqiang9/ArtText')
            }
        );
    }
}