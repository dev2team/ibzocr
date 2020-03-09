import { CreateElement } from 'vue';
import store from '../../store';
import { Util } from '../util/util';

/**
 * 代码表
 *
 * @export
 * @class CodeList
 */
export class CodeList {

    /**
     * 获取 CodeList 单例对象
     *
     * @static
     * @returns {CodeList}
     * @memberof CodeList
     */
    public static getInstance(): CodeList {
        if (!CodeList.codeList) {
            CodeList.codeList = new CodeList();
        }
        return this.codeList;
    }

    /**
     * 单例变量声明
     *
     * @private
     * @static
     * @type {CodeList}
     * @memberof CodeList
     */
    private static codeList: CodeList;

    /**
     * Creates an instance of CodeList.
     * 私有构造，拒绝通过 new 创建对象
     *
     * @memberof CodeList
     */
    private constructor() {

    }


    public getCodeItemTextByValue(srfkey: string,value: any) :string {
        const codelist = store.getters.getCodeList(srfkey);
        if(!codelist)
            return "";
        let retArr: any[] = this.getCodeItemsByMultipleValue(codelist,value);
        if(retArr.length==0){
            return (codelist.emptytext)?codelist.emptytext:"";
        }
        else
        {
            let ret="";
            let textSeparator:string=codelist.textseparator;
            if (!textSeparator || Object.is(textSeparator, '')) {
                textSeparator = '、';
            }
            retArr.forEach((_item: any, index: any) => {
                const text = _item.text;
                if (index>0) {
                    ret=ret+textSeparator;
                }
                ret=ret+text;
            });
            return ret;
        }
    }


    public getCodeItemByValue(srfkey: string,value: any) :any {
        const codelist = store.getters.getCodeList(srfkey);
        let ret=this.getCodeItemByOneValue(codelist,codelist.items,value);
        if(!ret)
            ret={id:value,value:value,text:"unknow("+value+")",label:"unknow("+value+")"}
        return  ret;
    }

    public getCodeItemsByValue(srfkey: string,value: any) :any[] {
        const codelist = store.getters.getCodeList(srfkey);
        return this.getCodeItemsByMultipleValue(codelist,value);
    }
    private getCodeItemsByMultipleValue(codelist:any,value: any) :any[] {

        if(!codelist)
            return [];
        if(!value) {
            return [];
        }
        let ormode="STR"
        if(codelist.ormode)
            ormode=codelist.ormode;
        if(ormode==='NUM'&&Object.is(Util.typeOf(value), 'number'))
            return this.getCodeItemsByNumOrValue(codelist,codelist.items,value);
        else if (Object.is(Util.typeOf(value), 'number'))
        {
            let ret=this.getCodeItemByOneValue(codelist,codelist.items,value);
            let retArr: any[] = [];
            if(!ret)
            {
                retArr.push(ret);
            }
            return retArr;
        }
        else{
            return this.getCodeItemsByStrOrValue(codelist,codelist.items,value,codelist.valueseparator);
        }
    }

    private getCodeItemByOneValue(codelist: any,items: any[] ,value: any) :any  {
        if(!codelist) {
            return null;
        }
        if(!value) {
            return {id:null,value:null,text:(codelist.emtpytext)?codelist.emtpytext:"",label:(codelist.emtpytext)?codelist.emtpytext:""}
        }
        if(!items) {
            items=codelist.items;
        }

        const match = items.find((_item: any) => Object.is(_item.value, value));
        if(match) {
            return JSON.parse(JSON.stringify(match));
        }
        else {
            for(const item of items) {
                const children: any = item.children;
                if (children&&children!=null&&children.length!=null&&children.length!=0) {
                    const submatch = this.getCodeItemByOneValue(codelist,children, value);
                    if (submatch) {
                        return submatch;
                    }
                }
            }
        }
        return null;
    }

    private getCodeItemsByNumOrValue(codelist: any,items: any[] ,nValue: any) :any[]  {
        if(!codelist) {
            return [];
        }
        if(!nValue) {
            return [];
        }
        if(!items) {
            items=codelist.items;
        }
        let retArr: any[] = [];
        items.forEach((item: any, index: any) => {
            const codevalue = item.value;
            if ((parseInt(codevalue, 10) & nValue) > 0) {
                retArr.push(JSON.parse(JSON.stringify(item)));
            }
        });
        return retArr;
    }

    private getCodeItemsByStrOrValue(codelist: any,items: any[] ,value: any,valueSeparator: any):any[] {
        if(!codelist) {
            return [];
        }
        if(!value) {
            return [];
        }
        if(!items) {
            items=codelist.items;
        }
        let retArr: any[] = [];

        if(!valueSeparator)
            valueSeparator=codelist.valueseparator;

        if(!valueSeparator)
            valueSeparator=";";

        let strValue:string=value;
        strValue=strValue.replace(",",valueSeparator);
        strValue=strValue.replace(";",valueSeparator);

        let values:any[] = [...strValue.split(valueSeparator)];
        values.forEach((val: any, index: any) => {
            const codeItem = this.getCodeItemByOneValue(codelist,items,val);
            if (codeItem) {
                retArr.push(codeItem);
            }
        });

        return retArr ;
    }


    /**
     * 获取代码项
     *
     * @private
     * @param {any[]} items
     * @param {*} value
     * @returns {*}
     * @memberof CodeList
     */
    private getItem(items: any[], value: any): any {
        let result: any = {};
        const arr: Array<any> = items.filter(item => Object.is(item.value, value));
        if (arr.length !== 1) {
            return undefined;
        }

        result = { ...arr[0] };
        return result;
    }

    /**
     * 绘制代码内容
     *
     * @private
     * @param {CreateElement} h
     * @param {*} [item={}]
     * @returns
     * @memberof CodeList
     */
    private renderCodeItemText(h: CreateElement, item: any = {}) {
        const color = item.color;
        const textCls = item.textcls;
        const iconCls: any = item.iconcls;
        const realText = item.text;
        const staticStyle: any = color ? { color: color } : {};
        return (
            <span>
                {iconCls ? <i class={iconCls}></i> + '&nbsp;' : ''}
                {(textCls || color) ? <span class={textCls} style={staticStyle}>{realText}</span> : realText}
            </span>
        );
    }

    /**
     * 常规内容绘制
     *
     * @param {CreateElement} h
     * @param {{ items: any[]; value: string; emtpytext: string; }} { items, value, emtpytext }
     * @returns
     * @memberof CodeList
     */
    public render(h: CreateElement, { srfkey, value, emtpytext }: { srfkey: string; value: string; emtpytext: string; }) {

        if (Object.is(Util.typeOf(value), 'undefined') || Object.is(Util.typeOf(value), 'null')) {
            return (
                <span>{emtpytext}</span>
            );
        }


        const arrayValue: Array<any> = this.getCodeItemsByValue(srfkey,value);
        return (
            <span>
                    {
                        arrayValue.map((item: any, index: number) => {
                            return (
                                <span>
                                {index > 0 ? '、' : ''}
                                    {this.renderCodeItemText(h, item)}
                                </span>
                            );
                        })
                    }
            </span>
        );

    }

    /**
     * 数字或处理
     *
     * @param {CreateElement} h
     * @param {{ srfkey: ''; value: string; emtpytext: string; textSeparator: string; }} { srfkey, value, emtpytext, textSeparator }
     * @returns
     * @memberof CodeList
     */
    public renderNumOr(h: CreateElement, { srfkey, value, emtpytext, textSeparator }: { srfkey: ''; value: string; emtpytext: string; textSeparator: string; }) {
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        if (Object.is(Util.typeOf(value), 'undefined') || Object.is(Util.typeOf(value), 'null')) {
            return (
                <span>{emtpytext}</span>
            );
        }


        const arrayValue: Array<any> = this.getCodeItemsByNumOrValue(store.getters.getCodeList(srfkey),[],value);
        return (
            <span>
                {
                    arrayValue.map((item: any, index: number) => {
                        return (
                            <span>
                                {index > 0 ? textSeparator : ''}
                                {this.renderCodeItemText(h, item)}
                            </span>
                        );
                    })
                }
            </span>
        );
    }

    /**
     * 文本或处理
     *
     * @param {CreateElement} h
     * @param {{ srfkey: string; value: any; emtpytext: any; textSeparator: any; valueSeparator: any; }} { srfkey, value, emtpytext, textSeparator, valueSeparator }
     * @returns
     * @memberof CodeList
     */
    public renderStrOr(h: CreateElement, { srfkey, value, emtpytext, textSeparator, valueSeparator }: { srfkey: string; value: any; emtpytext: any; textSeparator: any; valueSeparator: any; }) {
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        if (Object.is(Util.typeOf(value), 'undefined') || Object.is(Util.typeOf(value), 'null')) {
            return (
                <span>{emtpytext}</span>
            );
        }


        const arrayValue: Array<any> = this.getCodeItemsByStrOrValue(store.getters.getCodeList(srfkey),[],value,valueSeparator);
        return (
            <span>
                {
                    arrayValue.map((item: any, index: number) => {
                        return (
                            <span>
                                {index > 0 ? textSeparator : ''}
                                {this.renderCodeItemText(h, item)}
                            </span>
                        );
                    })
                }
            </span>
        );
    }
}