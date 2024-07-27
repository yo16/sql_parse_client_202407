// node-sql-parserのExpr（式）を解釈し、使用する

import { Expr, ExprList, ExpressionValue } from "node-sql-parser";

import { TableColumns } from "./TableColumns";
import { ParseExpressionValue } from "./ParseExpressionValue";

export class ParseExpr {
    private _expr: Expr;
    private _exprType: 'BoolOperation' | 'ExpressionValue';
    private _tableColumns: TableColumns;

    constructor(expr: Expr) {
        this._expr = expr;
        if ( (expr.operator === 'AND') || (expr.operator === 'OR') ) {
            this._exprType = 'BoolOperation';
        } else {
            this._exprType = 'ExpressionValue';
        }
        this._tableColumns = new TableColumns();

        // 解釈しておく
        if (this._exprType === 'BoolOperation') {
            this._tableColumns = ParseExpr.parseColumnsBoolOperation(expr);
        } else {
            this._tableColumns = ParseExpr.parseColumnsExpressionValue(expr);
        }
    }

    // 解釈済みの列情報を返す
    public getTableColumns(): TableColumns {
        return this._tableColumns;
    }

    // BoolOperationのexprを解釈して、列名の配列を取得
    private static parseColumnsBoolOperation(expr: Expr): TableColumns {
        const leftExpr: ParseExpr = new ParseExpr(expr.left as Expr);
        const rightExpr: ParseExpr = new ParseExpr(expr.right as Expr);

        const leftTcs: TableColumns = leftExpr.getTableColumns();
        const rightTcs: TableColumns = rightExpr.getTableColumns();
        leftTcs.mergeTableColumns(rightTcs);

        return leftTcs;
    }

    // ExpressionValueのexprを解釈して、列名の配列を取得
    private static parseColumnsExpressionValue(expr: Expr): TableColumns {
        const leftExprVal: ParseExpressionValue = new ParseExpressionValue(
            expr.left as ExpressionValue
        );
        const rightValueTemp: ExpressionValue | ExprList
            = expr.right as ExpressionValue | ExprList;
        let rightExprValues: ExpressionValue[];
        if (rightValueTemp.type === 'expr_list') {
            rightExprValues = (rightValueTemp as ExprList).value;
        } else {
            rightExprValues = [rightValueTemp as ExpressionValue];
        }
        const rightExprVals: ParseExpressionValue[]
            = rightExprValues.map((ev) => new ParseExpressionValue(ev));

        const leftTcs: TableColumns = leftExprVal.getTableColumns();
        const rightTcs: TableColumns = rightExprVals.reduce(
            (accumTcs: TableColumns, curExprVal: ParseExpressionValue) => {
                const tcs: TableColumns = curExprVal.getTableColumns();
                accumTcs.mergeTableColumns(tcs);
                return accumTcs;
            },
            new TableColumns()
        );

        leftTcs.mergeTableColumns(rightTcs);
        return leftTcs;
    }
}
