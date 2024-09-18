// WithsManagerクラス
//    - 概要
//        - With句全体を管理するオブジェクト
//    - プロパティ
//        - WithsGroupManagerリスト
//    - メソッド
//        - withリストを追加
//            - withを１つ追加
//        - withを１つ追加（private）
//            - WithInfoをインスタンス化し、パース
//            - 親テーブルが所属するWithsGroupManagerの１つ下の階層に、WithManagerを追加
//                - １つ下の階層が存在しない場合は、最下層にWithsGroupManagerを作成
//        - withの名前リストを取得
//        - WithsGroupManagerリストの要素数を取得
//        - with句の有無

import { ClauseWiths, ClauseWith } from "@/QueryComponents/ClauseWiths";
import { WithsGroupManager } from "./WithsGroupManager";
import { WithInfo } from "./WithInfo";

export class WithsManager {
    private _withsGroupList: WithsGroupManager[];

    constructor() {
        this._withsGroupList = [];
    }

    // withリストを追加
    public addWiths(withs: ClauseWiths) {
        withs.withs.forEach((w: ClauseWith) => this.addOneWith(w));
    }

    // withを１つ追加（private）
    private addOneWith(curWith: ClauseWith) {
        // WithInfoをインスタンス化し、パース
        const curWithInfo: WithInfo = new WithInfo(curWith);

        // すべての親テーブルに対して上位グループを探す
        let curParentGroupIndex: number = -1;
        for (let i=0; i<curWithInfo.parentTables.length; i++){
            // 親テーブル
            const curParentTable: string = curWithInfo.parentTables[i];

            // 今の親テーブルが、グループに存在するか確認
            let groupIndex = -1;
            for (let j=0; j<this._withsGroupList.length; j++) {
                if (this._withsGroupList[j].hasTable(curParentTable)) {
                    groupIndex = j;
                    break;
                }
            }
            if (groupIndex < 0) {
                // 見つからなかった場合は、最上位である0
                curParentGroupIndex = 0;
            } else {
                // 見つかった場合は、見つかったindexの下
                curParentGroupIndex = groupIndex + 1;
            }

            // この段階で挿入しようとしているグループが存在しない（最下位）である場合は最下位で確定
            // それ以降の親テーブルについて調べる必要はない
            if (this._withsGroupList.length <= curParentGroupIndex) {
                // 最下位に１つ追加
                this._withsGroupList.push(new WithsGroupManager());
                break;
            }
        }

        // グループへWithInfoを追加
        this._withsGroupList[curParentGroupIndex].addWithInfo(curWithInfo);
    }

    // withの名前リストを取得
    public get tableNames(): string[] {
        return this._withsGroupList.map((wgm: WithsGroupManager) => wgm.tableNames).flat();
    }

    // WithsGroupManagerリストを取得
    public get withsGroupList(): WithsGroupManager[] {
        return this._withsGroupList;
    }

    // with句の有無
    public isEmpty(): boolean {
        return (this._withsGroupList.length === 0);
    }
}
