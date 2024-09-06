import { useState, useEffect, useMemo } from "react";

import { ClauseColumn } from "@/QueryComponents/ClauseColumns";
import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementsBox } from "./ColumnElementsBox";

import type { BoxSize } from "./types";
import { COLUMN_NAME_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";


interface ClauseColumnBoxProps {
    clauseColumn: ClauseColumn;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseColumnBox({
    clauseColumn,
    onSetSize,
}: ClauseColumnBoxProps) {
    // ElementsBoxのサイズ（Element"s"は１つしかない）
    const [columnElementsSize, setColumnElementsSize] = useState<BoxSize>({width: 0, height: 0});

    // この要素のサイズ
    const curSize = useMemo(
        () => {
            const newCurWidth: number = columnElementsSize.width;
            const newCurHeight: number = COLUMN_NAME_HEIGHT + columnElementsSize.height;

            return {
                width: newCurWidth,
                height: newCurHeight
            };
        },
        [columnElementsSize]
    )

    function handleOnSetSize(newSize: BoxSize) {
        setColumnElementsSize(newSize);
    }

    // 自分のサイズを通知
    useEffect(
        () => onSetSize(curSize),
        [columnElementsSize]
    );

    
    const tc: TableColumns = clauseColumn.tableCols;
    const columnName: string = clauseColumn.columnName;
    return (
        <>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#ff0"}
            />
            <text
                {...(getTextPosByHeight(COLUMN_NAME_HEIGHT))}
            >
                {columnName}
            </text>

            {(tc.columnCount>1) && (
                <g
                    transform={`translate(0, ${COLUMN_NAME_HEIGHT})`}
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


