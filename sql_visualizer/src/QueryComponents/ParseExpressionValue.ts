import { ExpressionValue, ExprList, ColumnRef, Function, Case, AggrFunc, Cast, Expr } from "node-sql-parser";

import { ParseExpr } from "./ParseExpr";
import { TableAndColumn, TableColumns } from "./TableColumns";


export class ParseExpressionValue {
    private _exprVal: ExpressionValue;
    private _exprValType: 'ColumnRef' | 'Param' | 'Function'
        | 'Case' | 'AggrFunc' | 'Cast' | 'Interval' | 'Value' | 'Binary_expr';
    private _tcs: TableColumns;

    constructor(exprVal: ExpressionValue) {
        if (exprVal.type === 'column_ref') {
            this._exprValType = 'ColumnRef';
        } else if (exprVal.type === 'param') {
            this._exprValType = 'Param';
        } else if (exprVal.type === 'function') {
            this._exprValType = 'Function';
        } else if (exprVal.type === 'case') {
            this._exprValType = 'Case';
        } else if (exprVal.type === 'aggr_func') {
            this._exprValType = 'AggrFunc';
        } else if (exprVal.type === 'cast') {
            this._exprValType = 'Cast';
        } else if (exprVal.type === 'interval') {
            this._exprValType = 'Interval';
        } else if (exprVal.type === 'binary_expr') {
            this._exprValType = 'Binary_expr';
        } else {
            // それ以外はすべてvalue
            // 'string'、'number'、'bool'など（ValueExpr）
            this._exprValType = 'Value';
        }
        this._exprVal = exprVal;
        this._tcs = new TableColumns();

        // 必要に応じて、columnsを解釈しておく
        // -- ColumnRef
        if (this._exprValType === 'ColumnRef') {
            const exprVal: ColumnRef = this._exprVal as ColumnRef;

            // stringのときのみ、設定する
            // { expr: ValueExpr } の場合は、値なので列名としては登録しない
            if (typeof exprVal.column === 'string') {
                this._tcs.addTableColumn({
                    tableName: exprVal.table,
                    columnName: exprVal.column,
                } as TableAndColumn);
            }
        }

        // -- Function
        else if (this._exprValType === 'Function') {
            const exprVal: Function = this._exprVal as Function;

            // argsがExprList
            if (exprVal.args) {
                const args: ExprList = exprVal.args;
                args.value.forEach(
                    (argVal: ExpressionValue) => {
                        const ev: ParseExpressionValue = new ParseExpressionValue(argVal);
                        const tc: TableColumns = ev.getTableColumns();
                        this._tcs.mergeTableColumns(tc);
                    }
                );
            }
        }

        // -- Case
        else if (this._exprValType === 'Case') {
            const exprVal: Case = this._exprVal as Case;

            exprVal.args.forEach((arg) => {
                // cond(whenにだけある)
                if (arg.type === 'when') {
                    const expr: ParseExpr = new ParseExpr(arg.cond);
                    const tcCond: TableColumns = expr.getTableColumns();
                    this._tcs.mergeTableColumns(tcCond);
                }

                // result
                const ev: ParseExpressionValue = new ParseExpressionValue(arg.result);
                const tcResult: TableColumns = ev.getTableColumns();
                this._tcs.mergeTableColumns(tcResult);
            })
        }
        
        // -- AggrFunc
        // args.orderby.exprはanyのため、対応しない（列名 or 列番号だと思うけど）
        else if (this._exprValType === 'AggrFunc') {
            const exprVal: AggrFunc = this._exprVal as AggrFunc;

            const argExprVal: ParseExpressionValue
                = new ParseExpressionValue(exprVal.args.expr);
            const tc: TableColumns = argExprVal.getTableColumns();
            this._tcs.mergeTableColumns(tc);
        }

        // -- Value
        //// なし

        // -- Cast
        else if (this._exprValType === 'Cast') {
            const exprVal: Cast = this._exprVal as Cast;

            const expr: ParseExpr = new ParseExpr(exprVal.expr);
            const tc: TableColumns = expr.getTableColumns();
            this._tcs.mergeTableColumns(tc);
        }

        // -- Interval
        //// なし

        // -- Binary_expr
        else if (this._exprValType === 'Binary_expr') {
            // ExprValが入るべき場所に、Exprが入っているケース
            const originExpr: Expr = this._exprVal as unknown as Expr;
            const parsedExpr: ParseExpr = new ParseExpr(originExpr);
            const tc: TableColumns = parsedExpr.getTableColumns();
            this._tcs.mergeTableColumns(tc);
        }
    }

    public getTableColumns(): TableColumns {
        return this._tcs;
    }
}
