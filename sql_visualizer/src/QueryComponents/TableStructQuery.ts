import { AST, Select as NspSelect } from "node-sql-parser";

import { TableStruct } from "./TableStruct";


export abstract class TableStructQuery extends TableStruct {
    private _ast: AST;
    private _queryType: string;

    constructor(ast: AST, as_: string | null) {
        // Queryは、名前はないが、asはあるときがある
        super(null, "(query)", as_);
        
        this._ast = ast;
        this._queryType = ast.type;
    }
}
