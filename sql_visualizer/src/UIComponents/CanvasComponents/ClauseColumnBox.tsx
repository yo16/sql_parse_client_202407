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
//    // この要素のサイズ
//    const [curSize, setCurSize] = useState<BoxSize>({width: 0, height: 0});
//    //const [curWidth, setCurWidth] = useState<number>(COLUMN_WIDTH);
//    //const [curHeight, setCurHeight] = useState<number>(COLUMN_NAME_HEIGHT);

    // ElementsBoxのサイズ（Element"s"は１つしかない）
//    //const [columnElementsWidth, setColumnElementsWidth] = useState<number>(0);
//    //const [columnElementsHeight, setColumnElementsHeight] = useState<number>(0);
    const [columnElementsSize, setColumnElementsSize] = useState<BoxSize>({width: 0, height: 0});

    // この要素のサイズ
    const curSize = useMemo(
        () => {
            const newCurWidth: number = columnElementsSize.width;
            const newCurHeight: number = COLUMN_NAME_HEIGHT + columnElementsSize.width;

            return {
                width: newCurWidth,
                height: newCurHeight
            };
        },
        [columnElementsSize]
    )

//    useEffect(() => {
//        const newWidth: number = Math.max(COLUMN_WIDTH, curWidth)
//        const newHeight: number = COLUMN_NAME_HEIGHT + columnElementsHeight;
//    
//        setCurWidth(newWidth);
//        setCurHeight(newHeight);
//        onSetSize(curWidth, newHeight);
//    }, [clauseColumn, columnElementsWidth, columnElementsHeight])

    function handleOnSetSize(newSize: BoxSize) {
        setColumnElementsSize(newSize);
//        setColumnElementsWidth(w);
//        setColumnElementsHeight(h);
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
                    transform={`translate(0, ${curSize.height})`}
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


