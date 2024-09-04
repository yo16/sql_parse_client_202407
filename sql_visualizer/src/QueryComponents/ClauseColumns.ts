import { Column as NspColumn } from 'node-sql-parser'

import { TableColumns } from './TableColumns';
import { ParseExpressionValue } from './ParseExpressionValue';

export class ClauseColumns {
    private _columns: any[] | NspColumn[];
    private _columnObjs: ClauseColumn[];

    constructor(columns: any[] | NspColumn[]) {
        this._columns = columns;

        this._columnObjs = columns.map((c) => new ClauseColumn(c));
    }

    get columns(): ClauseColumn[] {
        return this._columnObjs;
    }

    get columnCount(): number {
        return this._columns.length;
    }
}


export class ClauseColumn {
    private _columnType: 'Column' | 'any';

    private _as: string | null = null;
    private _tableColumns: TableColumns;

    constructor(column: any | NspColumn) {
        if ( ('expr' in column) && ('as' in column) ) {
            this._columnType = 'Column';
        } else {
            this._columnType = 'any';
        }

        // 'Column'のときだけパースする
        if (this._columnType === 'Column') {
            const nspCol: NspColumn = column as NspColumn;

            this._as = nspCol.as;
            const ev: ParseExpressionValue = new ParseExpressionValue(
                nspCol.expr
            );
            this._tableColumns = ev.getTableColumns();
        }
        // any
        else {
            // anyでもColumnでも、同じ操作ができるように、空のTableColumnsを作っておく
            this._tableColumns = new TableColumns();
        }
    }

    get columnName(): string {
        if (this._as) { return this._as}
        
        if (this._tableColumns.columnCount === 1) {
            const tables = this._tableColumns.getTables();
            return this._tableColumns.getColumnsByTable(tables[0])[0];
        }

        return "(composite column)";
    }

    get tableCols(): TableColumns {
        return this._tableColumns;
    }

    get tables(): string[] {
        return this._tableColumns.getTables();
    }

    columnsByTable(tableName: string): string[] {
        return this._tableColumns.getColumnsByTable(tableName);
    }
}
