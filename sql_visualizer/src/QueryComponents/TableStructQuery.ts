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
