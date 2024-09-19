import { AST, Select as NspSelect } from "node-sql-parser";

import { QuerySelect } from './QuerySelect';
import { TableStructQuery } from "./TableStructQuery";


export function getTableStructQueryObj(
    ast: AST,
    as_: string | undefined = undefined
): TableStructQuery | null {
    if (ast.type === 'select') {
        return new QuerySelect(ast as NspSelect, as_);
    }

    return null;
}
