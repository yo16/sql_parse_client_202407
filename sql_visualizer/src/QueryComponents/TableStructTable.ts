
import { TableStruct } from "./TableStruct";

export class TableStructTable extends TableStruct {
    private _columns: string[];

    constructor(db: string | null, tableName: string) {
        super(db, tableName);

        this._columns = [];
    }

    public addColumns(columns: string[]): void {
        columns.forEach((c) => this.addColumn(c));
    }
    public addColumn(columnName: string): void {
        this._columns.push(columnName);
    }
}
