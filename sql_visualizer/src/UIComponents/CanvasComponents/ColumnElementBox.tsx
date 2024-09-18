import { useEffect, useMemo } from "react";

import {
    COLUMN_WIDTH, COLELM_HEIGHT
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
    const curSize: BoxSize = useMemo(
        ()=>({width: COLUMN_WIDTH, height: COLELM_HEIGHT}),
        []
    );

    function createTableColumnName(tableName: string, columnName: string): string {
        return `${tableName}.${columnName}`;
    }
    
    // この要素のサイズは変わらないので、初回だけ、親へ通知
    useEffect(
        () => onSetSize(curSize),
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
                {...getTextPosByHeight(COLELM_HEIGHT)}
                fill={"#f60"}
            >
                {createTableColumnName(tableName, columnName)}
            </text>
        </>
    )
}
