import { From as NspFrom, BaseFrom, Join as JoinFrom, TableExpr as NspTableExprFrom } from 'node-sql-parser'

import { TableStruct } from './TableStruct';
import { TableStructTable } from './TableStructTable';
import { TableStructQuery } from './TableStructQuery';
import { getTableStructQueryObj } from './getTableStructQueryObj';
import { TableColumns } from './TableColumns';
import { ParseExpr } from './ParseExpr';

export class ClauseFroms {
    private _froms: ClauseFrom[];

    constructor(froms: NspFrom[] | null) {
        this._froms = (froms? froms: []).map((f) => new ClauseFrom(f));
    }

    get froms(): ClauseFrom[] {
        return this._froms;
    }

    get fromCount(): number {
        return this._froms.length;
    }

    get fromNames(): (string | undefined)[] {
        return this._froms.map((f)=>f.tableName);
    }
}


export class ClauseFrom {
    private _from: NspFrom;
    private _fromType: 'BaseFrom' | 'Join' | 'TableExpr' | 'Dual';
    private _tableStruct: TableStruct | null = null;

    constructor(from: NspFrom) {
        this._from = from;

        // fromのタイプを判定
        if ('join' in from) {
            this._fromType = 'Join';
        } else if ('table' in from) {
            this._fromType = 'BaseFrom';
        } else if (('type' in from) && (from.type === 'dual')) {
            this._fromType = 'Dual';
        } else {
            this._fromType = 'TableExpr';
        }

        // タイプごとにパース
        // -- BaseFrom
        if (this._fromType === 'BaseFrom') {
            const baseFrom: BaseFrom = from as BaseFrom;
            this._tableStruct = new TableStructTable(
                baseFrom.db,
                baseFrom.table
            );
        }
        
        // -- Join
        else if (this._fromType === 'Join') {
            const joinFrom: JoinFrom = from as JoinFrom;
            const joinedTable = new TableStructTable(
                joinFrom.db,
                joinFrom.table
            );

            // usingかonのいずれかを使用する
            if (('on' in joinFrom) && (joinFrom.on)) {
                // Exprを解釈して列を得る
                const expr: ParseExpr = new ParseExpr(joinFrom.on);
                const tc: TableColumns = expr.getTableColumns();
                // テーブル名はnullもありうるが、joinのどちらのものであるかの判定が難しいので、未実装★
                const cols: string[] = tc.getColumnsByTable(joinFrom.table);
                // 列を追加
                joinedTable.addColumns(cols);

            } else if ('using' in joinFrom) {   // 念のため確認
                // 列を追加
                if (joinFrom.using) {
                    joinedTable.addColumns(joinFrom.using);
                }
            } else {
                console.error('Neither "on" nor "using" is found in join-from');
            }

            this._tableStruct = joinedTable;
        }
        
        // -- TableExpr
        else if (this._fromType === 'TableExpr') {
            const tableExprFrom: NspTableExprFrom = from as NspTableExprFrom;

            const tcq: TableStructQuery | null = getTableStructQueryObj(
                tableExprFrom.expr.ast,
                tableExprFrom.as? tableExprFrom.as: undefined
            );
            if (tcq) {
                this._tableStruct = tcq;
            }
        }

        // -- Dual
        //// なし
    }

    get fromType() {
        // 'BaseFrom' | 'Join' | 'TableExpr' | 'Dual'
        return this._fromType;
    }
    get db() {
        return this._tableStruct?.db;
    }
    get tableName() {
        return this._tableStruct?.tableName;
    }
    get columns() {
        if (this._fromType === 'TableExpr') {
            console.error("未実装");
        } else if (this._fromType === 'Join') {
            return (this._tableStruct as TableStructTable).columns;
        }

        // それ以外の場合は空の配列を返す
        return [];
    }
    get tableStruct() {
        return this._tableStruct;
    }
}
