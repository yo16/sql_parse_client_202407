import { useEffect } from "react";

import { ClauseWith } from "@/QueryComponents/ClauseWiths";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";

interface ClauseWithBoxProps {
    clauseWith: ClauseWith;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseWithBox({
    clauseWith,
    width,
    height,
    onSetSize,
}: ClauseWithBoxProps) {
    function handleOnSetSize(w: number, h: number) {
        onSetSize(w, h);
    }

    return (
        <>
            <TableStructQuerySelectBox
                select={clauseWith.select}
                width={width}
                height={height}
                onSetSize={handleOnSetSize}
            />
        </>
    );
}
