import { Art } from "..";

/**容器, 实现控制反转 */
export default class Container {
    private bindMap = new Map();

    /**绑定属性 */
    public bind(identifier: string, clazz: any, constructorArgs?: Array<any>, renderFlag:boolean=false): void{
        this.bindMap.set(identifier, {
            clazz,
            constructorArgs: constructorArgs || [],
            renderFlag
        });
    }

    /**获取属性 */
    public get<T>(identifier: string, art: Art): T {
        const target = this.bindMap.get(identifier);

        const { clazz, constructorArgs, renderFlag} = target;
        if (renderFlag) {
            let newArgs = [];
            for (let arg of constructorArgs)
                if (arg.constructor === Object) 
                    if (arg['get'] == 'art')
                        newArgs.push(art)
                    else
                        newArgs.push(art.get(arg['get']))
                else 
                    newArgs.push(arg)
            return Reflect.construct(clazz, newArgs);
        } else 
            return Reflect.construct(clazz, constructorArgs);
    }

    /**容器是否存在属性 */
    public has(identifier: string): boolean{
        return this.bindMap.has(identifier);
    }
}