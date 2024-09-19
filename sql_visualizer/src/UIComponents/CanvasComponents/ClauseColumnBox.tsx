import { useState, useEffect, useMemo } from "react";

import { ClauseColumn } from "@/QueryComponents/ClauseColumns";
import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementsBox } from "./ColumnElementsBox";

import type { BoxSize } from "./types";
import { COLUMN_NAME_HEIGHT, COLUMN_WIDTH, COLELM_INDENT_WIDTH, COLELMS_PADDING } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";

import "./commonSvgStyles.css";

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
/*
columnElementsを上にもってきて、
字下げは、asの項目名にする
asがなければ、字下げしない

fromも同じようにする
同じロジックと同じサイズ

elementsと、このロジックを共通化できないか
*/

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
            + ((columnElementsSize.height>0)? COLELMS_PADDING*2: 0);    // elementsを表示する場合は上下のpadding
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

    // ColumnElementsBoxを描画するかどうかの判定
    const drawElementsBox: boolean = useMemo(
        () => {
            const tc: TableColumns = clauseColumn.tableCols;
            
            // 参照している列が２つ以上の場合は、表示
            if (tc.columnCount > 1) return true;

            // 参照している列がゼロの場合は、非表示
            if (tc.columnCount == 0) return false;

            // 以下は、参照している列が１つの場合
            
            const targetTable: string = tc.getTables()[0];
            const targetColumn: string = tc.getColumnsByTable(targetTable)[0];
            
            // 列名が一致している場合は、非表示（表示は不要）
            if (targetColumn === clauseColumn.columnName) return false;
            
            return true;
        },
        [clauseColumn]
    );

    return (
        <g
            className="columnBox"
        >
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                className="bg"
            />
            <text
                {...(getTextPosByHeight(COLUMN_NAME_HEIGHT))}
            >
                {clauseColumn.columnName}
            </text>

            {drawElementsBox && (
                <g
                    transform={`translate(${COLELMS_PADDING+COLELM_INDENT_WIDTH}, ${COLELMS_PADDING+COLUMN_NAME_HEIGHT})`}
                >
                    <ColumnElementsBox
                        tableColumns={clauseColumn.tableCols}
                        onSetSize={handleOnSetSize}
                    />
                </g>
            )}
        </g>
    );
}


