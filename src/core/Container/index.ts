/**容器, 实现控制反转 */
export default class Container {
    private bindMap = new Map();

    /**绑定属性 */
    public bind(identifier: string, clazz: any, constructorArgs?: Array<any>): void{
        this.bindMap.set(identifier, {
            clazz,
            constructorArgs: constructorArgs || []
        });
    }

    /**获取属性 */
    public get<T>(identifier: string): T {
        const target = this.bindMap.get(identifier);

        const { clazz, constructorArgs } = target;
        const inst = Reflect.construct(clazz, constructorArgs);

        return inst;
    }

    /**容器是否存在属性 */
    public has(identifier: string): boolean{
        return this.bindMap.has(identifier);
    }
}