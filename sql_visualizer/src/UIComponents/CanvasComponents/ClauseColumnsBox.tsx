import { useState, useEffect, useMemo } from "react";

import { ClauseColumns } from "@/QueryComponents/ClauseColumns";
import { ClauseColumnBox } from "./ClauseColumnBox";

import type { BoxSize } from "./types";
import {
    COLUMN_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT, COLUMN_NAME_HEIGHT, INCOLUMNS_ITEMS_PADDING
} from "./constCanvasComponents";
import { arraysEqual, getTextPosByHeight } from "./commonFunctions";


interface ClauseColumnsBoxProps {
    clauseColumns: ClauseColumns;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseColumnsBox({
    clauseColumns,
    onSetSize,
}: ClauseColumnsBoxProps) {
    // column要素群(ClauseColumnBox)の各々のサイズ
    const [columnsSize, setColumnsSize] = useState<BoxSize[]>(
        () => initializeColumnsSize(clauseColumns.columnCount)
    );

    // columnsBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            const newWidth = getCurWidth();
            const newHeight = getCurHeight();

            return {
                width: newWidth,
                height: newHeight
            };
        },
        [columnsSize]
    );

    function handleOnSetSize(newSize: BoxSize, i: number) {
        setColumnsSize((colsSize) => colsSize.map((cs, j) => ((i===j)? newSize: cs)));
    }

    // 自分のサイズを計算
    function getCurWidth() {
        return columnsSize.reduce(
            (acc, sz) => ((acc < sz.width)? sz.width: acc),
            COLUMN_WIDTH
        ) + INCLAUSE_ITEMS_PADDING*2;
    }
    function getCurHeight() {
        return columnsSize.reduce(
            (acc, sz, i) => (acc + ((i > 0)? INCOLUMNS_ITEMS_PADDING: 0) + sz.height),
            CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2 // "column"のヘッダーと上下
        );
    }

    useEffect(
        () => onSetSize(curSize),
        [columnsSize]
    );

    return (
        <>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#00f"}
            />
            
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={CLAUSE_HEADER_HEIGHT}
                fill={"#fff"}
            />
            <text
                {...(getTextPosByHeight(CLAUSE_HEADER_HEIGHT))}
                fontStyle={"italic"}
                fill={"#f00"}
            >
                column
            </text>

            {clauseColumns.columns.map((c, i)=>{
                // iより上のfrom句の累計 + INCLAUSE_ITEMS_PADDING
                let yPos: number = CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING;
                for(let j=0; j<i; j++) {
                    yPos += columnsSize[j].height;
                    yPos += INCOLUMNS_ITEMS_PADDING;
                }
                return (
                    <g
                        key={`G_ColumnBox_${i}`}
                        transform={`translate(${INCLAUSE_ITEMS_PADDING}, ${yPos})`}
                        name={`ColumnBox-${i}`}
                    >
                        <ClauseColumnBox
                            clauseColumn={c}
                            onSetSize={(newSize)=>{handleOnSetSize(newSize, i)}}
                        />
                    </g>
                )
            })}

        </>
    );
}


function initializeColumnsSize(colCount: number): BoxSize[] {
    return new Array(colCount).fill({width: 0, height: 0});
}
