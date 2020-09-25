import { _Object_ } from ".";

export class exportMdFile { 
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '导出'
    }

    click() {
        let [md, fileInfo] = this._object_.getFile();
        let filename = 'arttext';
        if (fileInfo.name) {
            filename = fileInfo.name;
        }
        let ele = document.createElement('a');
        ele.download = filename + '.md';
        ele.style.display = 'none';
        // 字符内容转变成blob地址
        let blob = new Blob([md]);
        ele.href = URL.createObjectURL(blob);

        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
    }
}

export class importMdFile {
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '导入';
    }

    public click(): void {
        let ele = document.createElement('input');
        ele.type = 'file';
        ele.accept = '.md';
        ele.style.display = 'none';

        document.body.appendChild(ele);
        ele.click();

        let _object_ = this._object_;
        console.log(_object_);
        ele.onchange = () => {
            const reader = new FileReader()
            reader.onload = () => {
                _object_.openFile(reader.result.toString(), { name: ele.files[0].name.replace(/.md$/, '') });
            }
            reader.readAsText(ele.files[0], 'utf8');
        }
        document.body.removeChild(ele);
    }
}

export class newMdFile {
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '新建';
    }

    public click(): void {
        this._object_.openFile('', {});
    }
}

export class Github { 
    static codeDescribe = 'Toolbar.add';

    _object_: _Object_;
    text: string;
    addDefaultClass: boolean;
    constructor(_object_) {
        this._object_ = _object_;
        this.text = '<span style="position: absolute;right: 12px;color:#1abc9c" title="项目地址">Github</span>';
        this.addDefaultClass = false;
    }

    click() {
        window.open('https://github.com/liziqiang9/ArtText');
    }
}