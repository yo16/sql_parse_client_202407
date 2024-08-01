// テーブル構造を表しているもの
// TableStructを、QueryとTableが継承している
// Queryは、問い合わせによってテーブルのような形を作るもの
// Tableは、DBに存在している物理テーブル

export abstract class TableStruct {
    private _db: string | null;
    private _tableName: string;

    constructor(db: string | null, tableName: string) {
        this._db = db;
        this._tableName = tableName;
    }
    tmpSetName(nm: string) {
        this._tableName += nm;
    }
}
