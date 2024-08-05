import { useState, useEffect } from "react";

import { ClauseColumn } from "@/QueryComponents/ClauseColumns";
import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementsBox } from "./ColumnElementsBox";

import { COLUMN_WIDTH, COLUMN_NAME_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";


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

    const [columnElementsWidth, setColumnElementsWidth] = useState<number>(0);
    const [columnElementsHeight, setColumnElementsHeight] = useState<number>(0);

    useEffect(() => {
        const newWidth: number = Math.max(COLUMN_WIDTH, curWidth)
        const newHeight: number = COLUMN_NAME_HEIGHT + columnElementsHeight;

        setCurWidth(newWidth);
        setCurHeight(newHeight);
        onSetSize(curWidth, newHeight);
    }, [clauseColumn, columnElementsWidth, columnElementsHeight])

    function handleOnSetSize(w: number, h: number) {
        setColumnElementsWidth(w);
        setColumnElementsHeight(h);
    }
    
    const tc: TableColumns = clauseColumn.tableCols;
    const columnName: string = clauseColumn.columnName;
    return (
        <>
            <rect
                x={0}
                y={0}
                width={curWidth}
                height={curHeight}
                fill={"#ff0"}
            />
            <text
                {...(getTextPosByHeight(COLUMN_NAME_HEIGHT))}
            >
                {columnName}
            </text>

            {(tc.columnCount>1) && (
                <g
                    transform={`translate(0, ${curHeight})`}
                >
                    <ColumnElementsBox
                        tableColumns={tc}
                        onSetSize={handleOnSetSize}
                    />
                </g>
            )}
        </>
    );
}


