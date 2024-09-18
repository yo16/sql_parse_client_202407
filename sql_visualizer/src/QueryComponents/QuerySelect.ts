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


// super(=TableStructQuery)._queryType === 'select'
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

    public get withs(): ClauseWiths {
        return this._withsClause;
    }

    public get froms(): ClauseFroms {
        return this._fromsClause;
    }

    public get columns(): ClauseColumns {
        return this._columns;
    }

    public get fromNames(): (string | undefined)[] {
        return this._fromsClause.fromNames;
    }

    public get columnNames(): string[] {
        return this._columns.columnNames;
    }
}
