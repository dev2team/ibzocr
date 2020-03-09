import { Subject } from 'rxjs';

/**
 * 主编辑表单
 *
 * @export
 * @class MainData
 */
export class MainData {

    /**
     * 忽略属性值变化
     *
     * @type {boolean}
     * @memberof MainData
     */
    public ignorefieldvaluechange: boolean = false;

    /**
     * 属性值变化
     *
     * @type {Subject<any>}
     * @memberof MainData
     */
    public fieldValueChange: Subject<any> = new Subject();

    /**
     * 更新时间
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfupdatedate: any = null;

    /**
     * 设置srfupdatedate值
     *
     * @memberof MainData
     */
    set srfupdatedate(val: any) {
        const oldVal = this._srfupdatedate;
        this._srfupdatedate = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfupdatedate', value: val });
        }
    }

    /**
     * 获取srfupdatedate值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfupdatedate(): any {
        return this._srfupdatedate;
    }

    /**
     * 
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srforikey: any = null;

    /**
     * 设置srforikey值
     *
     * @memberof MainData
     */
    set srforikey(val: any) {
        const oldVal = this._srforikey;
        this._srforikey = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srforikey', value: val });
        }
    }

    /**
     * 获取srforikey值
     *
     * @type {*}
     * @memberof MainData
     */
    get srforikey(): any {
        return this._srforikey;
    }

    /**
     * 识别记录标识
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfkey: any = null;

    /**
     * 设置srfkey值
     *
     * @memberof MainData
     */
    set srfkey(val: any) {
        const oldVal = this._srfkey;
        this._srfkey = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfkey', value: val });
        }
    }

    /**
     * 获取srfkey值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfkey(): any {
        return this._srfkey;
    }

    /**
     * 识别记录名称
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfmajortext: any = null;

    /**
     * 设置srfmajortext值
     *
     * @memberof MainData
     */
    set srfmajortext(val: any) {
        const oldVal = this._srfmajortext;
        this._srfmajortext = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfmajortext', value: val });
        }
    }

    /**
     * 获取srfmajortext值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfmajortext(): any {
        return this._srfmajortext;
    }

    /**
     * 
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srftempmode: any = null;

    /**
     * 设置srftempmode值
     *
     * @memberof MainData
     */
    set srftempmode(val: any) {
        const oldVal = this._srftempmode;
        this._srftempmode = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srftempmode', value: val });
        }
    }

    /**
     * 获取srftempmode值
     *
     * @type {*}
     * @memberof MainData
     */
    get srftempmode(): any {
        return this._srftempmode;
    }

    /**
     * 
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfuf: any = null;

    /**
     * 设置srfuf值
     *
     * @memberof MainData
     */
    set srfuf(val: any) {
        const oldVal = this._srfuf;
        this._srfuf = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfuf', value: val });
        }
    }

    /**
     * 获取srfuf值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfuf(): any {
        return this._srfuf;
    }

    /**
     * 
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfdeid: any = null;

    /**
     * 设置srfdeid值
     *
     * @memberof MainData
     */
    set srfdeid(val: any) {
        const oldVal = this._srfdeid;
        this._srfdeid = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfdeid', value: val });
        }
    }

    /**
     * 获取srfdeid值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfdeid(): any {
        return this._srfdeid;
    }

    /**
     * 
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _srfsourcekey: any = null;

    /**
     * 设置srfsourcekey值
     *
     * @memberof MainData
     */
    set srfsourcekey(val: any) {
        const oldVal = this._srfsourcekey;
        this._srfsourcekey = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'srfsourcekey', value: val });
        }
    }

    /**
     * 获取srfsourcekey值
     *
     * @type {*}
     * @memberof MainData
     */
    get srfsourcekey(): any {
        return this._srfsourcekey;
    }

    /**
     * 识别记录名称
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _ocrrecordname: any = null;

    /**
     * 设置ocrrecordname值
     *
     * @memberof MainData
     */
    set ocrrecordname(val: any) {
        const oldVal = this._ocrrecordname;
        this._ocrrecordname = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'ocrrecordname', value: val });
        }
    }

    /**
     * 获取ocrrecordname值
     *
     * @type {*}
     * @memberof MainData
     */
    get ocrrecordname(): any {
        return this._ocrrecordname;
    }

    /**
     * 建立人
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _createman: any = null;

    /**
     * 设置createman值
     *
     * @memberof MainData
     */
    set createman(val: any) {
        const oldVal = this._createman;
        this._createman = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'createman', value: val });
        }
    }

    /**
     * 获取createman值
     *
     * @type {*}
     * @memberof MainData
     */
    get createman(): any {
        return this._createman;
    }

    /**
     * 建立时间
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _createdate: any = null;

    /**
     * 设置createdate值
     *
     * @memberof MainData
     */
    set createdate(val: any) {
        const oldVal = this._createdate;
        this._createdate = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'createdate', value: val });
        }
    }

    /**
     * 获取createdate值
     *
     * @type {*}
     * @memberof MainData
     */
    get createdate(): any {
        return this._createdate;
    }

    /**
     * 更新人
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _updateman: any = null;

    /**
     * 设置updateman值
     *
     * @memberof MainData
     */
    set updateman(val: any) {
        const oldVal = this._updateman;
        this._updateman = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'updateman', value: val });
        }
    }

    /**
     * 获取updateman值
     *
     * @type {*}
     * @memberof MainData
     */
    get updateman(): any {
        return this._updateman;
    }

    /**
     * 更新时间
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _updatedate: any = null;

    /**
     * 设置updatedate值
     *
     * @memberof MainData
     */
    set updatedate(val: any) {
        const oldVal = this._updatedate;
        this._updatedate = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'updatedate', value: val });
        }
    }

    /**
     * 获取updatedate值
     *
     * @type {*}
     * @memberof MainData
     */
    get updatedate(): any {
        return this._updatedate;
    }

    /**
     * 识别记录标识
     *
     * @private
     * @type {*}
     * @memberof MainData
     */
    private _ocrrecordid: any = null;

    /**
     * 设置ocrrecordid值
     *
     * @memberof MainData
     */
    set ocrrecordid(val: any) {
        const oldVal = this._ocrrecordid;
        this._ocrrecordid = val;
        if (!Object.is(oldVal, val) && !this.ignorefieldvaluechange) {
            this.fieldValueChange.next({ name: 'ocrrecordid', value: val });
        }
    }

    /**
     * 获取ocrrecordid值
     *
     * @type {*}
     * @memberof MainData
     */
    get ocrrecordid(): any {
        return this._ocrrecordid;
    }

}