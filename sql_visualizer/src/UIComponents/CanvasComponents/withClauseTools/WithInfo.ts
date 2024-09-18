// WithInfoクラス
//    - 概要
//        - withごとの管理オブジェクト
//    - プロパティ
//        - withデータ
//        - 親テーブル名のリスト
//    - メソッド
//        - (コンストラクタ)
//            - パース
//        - withの名前を取得
//        - パース（private）
//        - 参照する親テーブル名リストを取得

import { ClauseWith } from "@/QueryComponents/ClauseWiths";
import { QuerySelect } from "@/QueryComponents/QuerySelect";

export class WithInfo {
    // withデータ
    private _with: ClauseWith;
    // 項目名リスト
    private _columnNames: string[];
    // 参照している親テーブル名リスト
    private _parentTables: string[];

    // コンストラクタ
    constructor(curWith: ClauseWith) {
        this._with = curWith;
        this._columnNames = [];
        this._parentTables = [];

        // パース
        this.parse();
    }

    // 名前を取得
    public get name(): string {
        return this._with.name;
    }

    // 項目名リストを取得
    public get columNames(): string[] {
        return this._columnNames;
    }

    // 参照する親テーブル名リストを取得
    public get parentTables(): string[] {
        return this._parentTables;
    }

    // selectオブジェクトを取得
    public get selectObj(): QuerySelect {
        return this._with.select;
    }

    // パース(private)
    private parse(): void {
        // 参照しているテーブルを取得する（undefined以外）
        this._parentTables = this._with.select.fromNames
            .filter((nm): nm is string => nm !== undefined);
    }
}
