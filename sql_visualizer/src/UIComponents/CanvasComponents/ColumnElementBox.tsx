import { useState, useEffect } from "react";

import {
    COLUMN_WIDTH, COLELM_HEIGHT, COLELM_INDENT_WIDTH
} from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";
import { BoxSize } from "./types.d";

// １つの列のために利用する列群のうちの１つ
interface ColumnElementBoxProps {
    tableName: string;
    columnName: string;
    onSetSize: (bs: BoxSize) => void;
}
export function ColumnElementBox({
    tableName,
    columnName,
    onSetSize,
}: ColumnElementBoxProps) {
    // この要素のサイズ
    const [curSize] = useState<BoxSize>(
        {width: COLUMN_WIDTH, height: COLELM_HEIGHT}
    );

    // 高さに合った位置を計算
    const textPosBase = getTextPosByHeight(COLELM_HEIGHT);
    // x位置をインデント分、ずらす
    const textPos = {...textPosBase, x: textPosBase.x + COLELM_INDENT_WIDTH};

    function createTableColumnName(tableName: string, columnName: string): string {
        return `${tableName}.${columnName}`;
    }
    
    // この要素のサイズは変わらないので、初回だけ、親へ通知
    useEffect(
        () => onSetSize({width: COLUMN_WIDTH, height: COLELM_HEIGHT} as BoxSize),
        []
    );

    return (
        <>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#ccc"}
            />
            <text
                {...textPos}
                fill={"#f60"}
            >
                {createTableColumnName(tableName, columnName)}
            </text>
        </>
    )
}
