// テーブル構造を表しているもの
// TableStructを、QueryとTableが継承している
// Queryは、問い合わせによってテーブルのような形を作るもの
// Tableは、DBに存在している物理テーブル

export abstract class TableStruct {
    private _db: string | null;
    private _tableName: string;
    private _as: string | null;

    constructor(db: string | null, tableName: string, as_: string | null) {
        this._db = db;
        this._tableName = tableName;
        this._as = as_;
    }
    
    get db() {
        return this._db;
    }
    get tableName() {
        return this._tableName;
    }
    get as_() {
        return this._as;
    }
}
