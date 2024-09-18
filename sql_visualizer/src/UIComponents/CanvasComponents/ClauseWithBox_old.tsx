import { useEffect } from "react";

import { ClauseWith } from "../../QueryComponents/ClauseWiths";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";
import { BoxSize } from "./types";

interface ClauseWithBoxProps {
    clauseWith: ClauseWith;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseWithBox({
    clauseWith,
    onSetSize,
}: ClauseWithBoxProps) {
    function handleOnSetSize(newSize: BoxSize) {
        onSetSize(newSize);
    }

    return (
        <>
            <TableStructQuerySelectBox
                select={clauseWith.select}
                onSetSize={handleOnSetSize}
            />
        </>
    );
}
