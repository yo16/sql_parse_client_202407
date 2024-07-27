import { AST, Select as NspSelect } from "node-sql-parser";

import { TableStruct } from "./TableStruct";


export abstract class TableStructQuery extends TableStruct {
    private _ast: AST;
    private _queryType: string;

    constructor(ast: AST, name: string = "query") {
        super(null, name);
        
        this._ast = ast;
        this._queryType = ast.type;
    }
}

export async function getTableStructQueryObj(
    ast: AST,
    name: string | undefined = undefined
): Promise<TableStructQuery | null> {
    const { QuerySelect } = await import('./QuerySelect'); // 動的インポートに変更
    if (ast.type === 'select') {
        return new QuerySelect(ast as NspSelect, name);
    }

    return null;
}
