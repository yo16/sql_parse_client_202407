// WithsGroupManagerクラス
//    - 概要
//        - 階層ごとの管理オブジェクト
//    - プロパティ
//        - WithInfoリスト
//    - メソッド
//        - WithInfoを１つ追加
//        - withの名前リストを取得
//        - withの名前に、引数の名前があるかどうかを確認

import { WithInfo } from "./WithInfo";

export class WithsGroupManager {
    private _withInfoList: WithInfo[];

    constructor() {
        this._withInfoList = [];
    }

    // WithInfoを１つ追加
    public addWithInfo( curWithInfo: WithInfo ) {
        this._withInfoList.push(curWithInfo);
    }

    // withの名前リストを取得
    public get tableNames(): string[] {
        return this._withInfoList.map((wi:WithInfo) => wi.name).flat();
    }

    // withInfoリストを取得
    public get withList(): WithInfo[] {
        return this._withInfoList;
    }
    
    // withの名前に、引数の名前があるかどうかを確認
    public hasTable(tableName: string): boolean {
        return this.tableNames.includes(tableName);
    }
}
