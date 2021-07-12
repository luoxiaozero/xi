import ArtText from '../../artText';
import { Config } from '../../config';
import { Art } from '../../core';
import Tool from '../../tool';

/**
 * 消息管理器
 */
export default class Message {
    dom: HTMLDivElement;
    timer: any;
    constructor(artText: ArtText) {
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-tool-message');
        this.timer = null;

        artText.get<Tool>('$tool').add([{ dom: this.dom }]);
    }

    /**
     * 创建一个消息
     * @param message 消息内容 
     * @param type 消息类型[info, error, warning]
     */
    public create(message: string, type: string = 'null') {
        let root = document.createElement('div');
        root.setAttribute('class', 'art-tool-message-body')

        let p = document.createElement('p');
        p.innerHTML = message;
        p.style.fontSize = '13px';
        p.style.fontWeight = '600';
        p.style.height = '100%';
        p.style.margin = '0';
        root.appendChild(p);

        if (type == 'info') {
            root.style.backgroundColor = '#edf2fc';
            root.style.borderColor = '#EBEEF5';
            root.style.color = '#909399';
        } else if (type == 'success') {
            root.style.backgroundColor = '#f0f9eb';
            root.style.borderColor = '#e1f3d8';
            root.style.color = '#67C23A';
        } else if (type == 'warning') {
            root.style.backgroundColor = '#fdf6ec';
            root.style.borderColor = '#faecd8';
            root.style.color = '#E6A23C';
        } else if (type == 'error') {
            root.style.backgroundColor = '#fde2e2';
            root.style.borderColor = '#e1f3d8';
            root.style.color = '#F56C6C';
        } else {
            root.style.backgroundColor = Config.theme.backgroundColor;
            root.style.color = Config.theme.color;
        }
        this.addMessage(root);
    }

    /**
     * 添加消息，并计时
     * @param messageDom 消息的dom值
     */
    private addMessage(messageDom: HTMLDivElement) {
        if (!this.timer) {
            let _this = this;
            this.timer = setTimeout(() => { _this.delMessage(); }, 3000);
        }
        messageDom.style.top = (40 + this.dom.childNodes.length * 60).toString() + 'px';
        this.dom.appendChild(messageDom);
    }

    /**
     * 计时到，删除消息
     */
    private delMessage() {
        this.dom.removeChild(this.dom.childNodes[0]);
        for (let i = 0; i < this.dom.childNodes.length; i++) {
            (<HTMLDivElement>this.dom.childNodes[i]).style.top = (40 + i * 60).toString() + 'px';
        }
        if (this.dom.childNodes.length) {
            let _this = this;
            this.timer = setTimeout(() => { _this.delMessage(); }, 3000);
        }
    }
}

export let MessageExport = {
    install: function (Art, options) {
        options['container'].bind('message', Message, [{'get': 'art'}], true);
        options['Tool'].addCss('.art-tool-message-body{overflow:hidden;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 4px;left: 50%;margin: -27px 0 0 -170px;position: fixed;position: fixed !important;top: 40px;height: 40px;line-height: 40px;width: 340px;padding: 1px 10px 1px 15px;transition: opacity .3s,transform .4s,top .4s,-webkit-transform .4s;z-index: 1000;}')
    },
    created: function (art: Art , options) {
        art.get<Message>('message');
    }
}