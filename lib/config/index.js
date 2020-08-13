class Config{
    constructor(config) {
        this.renderFlag = true;
        this.md = '';
        if(config.md){
            this.md = config.md;
        }
        
        this.model = 'editor';// read
        if(config.model){
            this.model = config.model;
        }
    }
}export default Config