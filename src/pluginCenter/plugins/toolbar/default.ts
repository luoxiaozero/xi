import Editor from "@/editor";
import { _Object_ } from "@/pluginCenter";




export class ExportMdFile { 
    static Name = 'ExportMdFile';

    _object_: _Object_;
    title: string;
    constructor(_object_: _Object_) {
        this._object_ = _object_;
        this.title = '导出';
        this._object_.emit('Toolbar.add', this);
    }

    click() {
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

export class ImportMdFile {
    static Name = 'ImportMdFile';

    _object_: _Object_;
    title: string;
    constructor(_object_: _Object_) {
        this._object_ = _object_;
        this.title = '导入';
        this._object_.emit('Toolbar.add', this);
    }

    public click(): void {
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
                _object_.openFile( { name: ele.files[0].name.replace(/.md$/, ''), defaultMd: reader.result.toString()});
            }
            reader.readAsText(ele.files[0], 'utf8');
        }
        document.body.removeChild(ele);
    }
}

export class NewMdFile {
    static Name = 'NewMdFile';

    _object_: _Object_;
    title: string;
    constructor(_object_: _Object_) {
        this._object_ = _object_;
        this.title = '新建';
        this._object_.emit('Toolbar.add', this);
    }

    public click(): void {
        this._object_.openFile();
    }
}

export class Github { 
    static Name = 'Github';

    _object_: _Object_;
    title: string;
    isDddDefaultClass: boolean;
    constructor(_object_: _Object_) {
        this._object_ = _object_;
        this.title = '<span style="position: absolute;right: 12px;color:#1abc9c" title="项目地址">Github</span>';
        this.isDddDefaultClass = false;
        this._object_.emit('Toolbar.add', this);
    }

    public click() {
        window.open('https://github.com/liziqiang9/ArtText');
    }
}