import Core from "../Core";

/**原型 */
export default class Art {

    constructor() {

    }

    /**获取值 */
    public get<T>(key: any): T{
        if (this[key] == undefined)
            this[key] = Core.container.get(key);
        
        return this[key];
    }

    /**设置值 */
    public set(key: any, value?: any): void{
        if (this[key] == undefined && Core.container.has(key)) 
            this[key] = Core.container.get(key);
    
        this[key] = value;
    }
}