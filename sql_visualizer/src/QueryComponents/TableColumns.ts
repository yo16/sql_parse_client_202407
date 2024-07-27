// テーブルと列の情報
// このインスタンスをもってデータを管理するつもりではなく、
// このクラスはデータを受け渡すための変数として使う予定
// テーブル名をキーに列を取り出せるようにする
// t1など、一時的なテーブル名が別の文脈であっても、単純に同じテーブルとみなすので注意

export type TableAndColumn = {
    tableName: string | null;
    columnName: string;
};

const NULL_TABLE_NAME = '___NULL___';   // この名前のテーブル名があった場合は、nullとみなされる

export class TableColumns {
    private _tableColumns: {[tableName: string]:string[]} = {};
    
    constructor() {
    }

    public getTables(): string[] {
        return Object.keys(this._tableColumns);
    }

    public getColumnsByTable(tableName: string | null): string[] {
        const curTableName: string = tableName? tableName: NULL_TABLE_NAME;
        return [...this._tableColumns[curTableName]];
    }

    // TableAndColumn形式の配列で、テーブルと列を追加
    public addTableColumns(tableAndColumns: TableAndColumn[]) {
        tableAndColumns.forEach((tc: TableAndColumn) => {
            this.addTableColumn(tc);
        })
    }

    // TableAndColumn形式で、テーブルと列を追加
    public addTableColumn(tableAndColumn: TableAndColumn) {
        const tableName: string = (tableAndColumn.tableName)? tableAndColumn.tableName: NULL_TABLE_NAME;
        if (tableName in this._tableColumns) {
            this._tableColumns[tableName].push(tableAndColumn.columnName);
        } else {
            this._tableColumns[tableName] = [tableAndColumn.columnName];
        }
    }

    // thisに、別のTableColumnsの各要素を追加
    public mergeTableColumns(tcs: TableColumns) {
        const tables: string[] = tcs.getTables();
        tables.forEach((t: string) => {
            const cols: string[] = tcs.getColumnsByTable(t);
            cols.forEach((c: string) => {
                this.addTableColumn({
                    tableName: t,
                    columnName: c,
                });
            });
        });
    }

    // DeepCopyしたインスタンスを返す
    public clone(): TableColumns {
        const newTableColumns = new TableColumns();
        newTableColumns.mergeTableColumns(this);
        return newTableColumns;
    }
}
