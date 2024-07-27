import {
    Select as NspSelect,
    Column as NspColumn,
    From as NspFrom,
    With as NspWith
} from 'node-sql-parser';

import { TableStructQuery } from './TableStructQuery';
import { ClauseColumns } from './ClauseColumns';
import { ClauseFroms } from './ClauseFroms';
import { ClauseWiths } from './ClauseWiths';


export class QuerySelect extends TableStructQuery {
    private _columns: ClauseColumns;
    private _fromsClause: ClauseFroms;
    private _withsClause: ClauseWiths;

    constructor(astSelect: NspSelect, name: string | undefined) {
        super(astSelect, name);

        this._columns = new ClauseColumns(astSelect.columns);
        this._fromsClause = new ClauseFroms(astSelect.from);
        this._withsClause = new ClauseWiths(astSelect.with);
    }
}
