import { useState } from "react";

import { ClauseColumn } from "@/QueryComponents/ClauseColumns";

import { COLUMN_WIDTH, COLUMN_NAME_HEIGHT } from "./constCanvasComponents";

interface ClauseColumnBoxProps {
    clauseColumn: ClauseColumn;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseColumnBox({
    clauseColumn,
    onSetSize,
}: ClauseColumnBoxProps) {
    const [curWidth, setCurWidth] = useState<number>(COLUMN_WIDTH);
    const [curHeight, setCurHeight] = useState<number>(COLUMN_NAME_HEIGHT);
    
    return (
        <></>
    );
}
