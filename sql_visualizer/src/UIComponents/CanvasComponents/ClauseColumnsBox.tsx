import { useState, useEffect, useMemo } from "react";

import { ClauseColumns } from "@/QueryComponents/ClauseColumns";
import { ClauseColumnBox } from "./ClauseColumnBox";

import type { BoxSize } from "./types";
import {
    COLUMN_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT, INCOLUMNS_ITEMS_PADDING
} from "./constCanvasComponents";
import { getTextPosByHeight, initializeBoxSizes } from "./commonFunctions";

import "./commonSvgStyles.css";

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
        () => initializeBoxSizes(clauseColumns.columnCount)
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
        <g
            className="columnsBox"
        >
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                className="bg"
            />
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={CLAUSE_HEADER_HEIGHT}
                className="clause-header-bg"
            />
            <text
                {...(getTextPosByHeight(CLAUSE_HEADER_HEIGHT))}
                className="clause-header-text"
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

        </g>
    );
}
