import { useState, useEffect, useMemo } from "react";

import { ClauseColumn } from "@/QueryComponents/ClauseColumns";
import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementsBox } from "./ColumnElementsBox";

import type { BoxSize } from "./types";
import { COLUMN_NAME_HEIGHT, COLUMN_WIDTH, COLELM_INDENT_WIDTH, COLELMS_PADDING } from "./constCanvasComponents";
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

    // ColumnBox全体のサイズ
    const curSize = useMemo(
        () => {
            const newCurWidth: number = getCurWidth();
            const newCurHeight: number = getCurHeight();

            return {
                width: newCurWidth,
                height: newCurHeight
            };
        },
        [columnElementsSize]
    )

    // 現在のサイズを取得
    function getCurWidth(): number {
        // columnElementsは、インデントも含めた幅と比較する
        const curWidth: number
            = Math.max((COLELM_INDENT_WIDTH+columnElementsSize.width), COLUMN_WIDTH)
            + COLELMS_PADDING*2;    // 左右
        return curWidth;
    }
    function getCurHeight(): number {
        const curHeight: number
            = COLUMN_NAME_HEIGHT
            + columnElementsSize.height
            + COLELMS_PADDING*2;    // 上下
        return curHeight;
    }

    // columnElementsSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [columnElementsSize]
    );

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize) {
        setColumnElementsSize(newSize);
    }

    
    const tc: TableColumns = clauseColumn.tableCols;
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
                {clauseColumn.columnName}
            </text>

            {(tc.columnCount>=1) && (   // 2項目以上、または、1項目の場合はrenamedだったら、描画
                <g
                    transform={`translate(${COLELMS_PADDING+COLELM_INDENT_WIDTH}, ${COLELMS_PADDING+COLUMN_NAME_HEIGHT})`}
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


