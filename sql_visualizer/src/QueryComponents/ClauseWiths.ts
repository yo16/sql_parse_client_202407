import { With as NspWith } from 'node-sql-parser'

import { QuerySelect } from './QuerySelect';


export class ClauseWiths {
    private _withs: ClauseWith[];

    constructor(withs: NspWith[] | null) {
        this._withs = (withs? withs: []).map((w) => new ClauseWith(w));
    }

    get withs(): ClauseWith[] {
        return this._withs;
    }
    get length() {
        return this._withs.length;
    }
}


export class ClauseWith {
    private _with: NspWith;
    private _select: QuerySelect;

    constructor(paramWith: NspWith) {
        this._with = paramWith;

        this._select = new QuerySelect(
            paramWith.stmt.ast,
            paramWith.name.value
        );
    }
    
    get select() {
        return this._select;
    }
}
