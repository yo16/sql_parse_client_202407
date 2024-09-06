import { useState, useEffect, useMemo } from "react";

import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementBox } from "./ColumnElementBox";

import type { BoxSize } from "./types";
import { COLELM_ITEMS_PADDING } from "./constCanvasComponents";

// １つの列のために利用する列群
interface ColumnElementsBoxProps {
    tableColumns: TableColumns;
    onSetSize: (newBox: BoxSize) => void;
}
export function ColumnElementsBox({
    tableColumns,
    onSetSize,
}: ColumnElementsBoxProps) {
    // ColumnElement要素たちのサイズ
    const [colElmsSize, setColElmnsSize]
        = useState<BoxSize[]>(
            () => new Array(tableColumns.columnCount).fill({width:0, height:0})
        );
    // この要素のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            const newCurWidth: number = getCurWidth();
            const newCurHeight: number = getCurHeight();

            return {
                width: newCurWidth,
                height: newCurHeight
            };
        },
        [colElmsSize]
    );
    
    // i番目のサイズ変更時のハンドル
    function handleOnSetSize(newBoxSize: BoxSize, i: number) {
        setColElmnsSize((elmsSize) => elmsSize.map((sz: BoxSize, j: number) => (i===j ? newBoxSize: sz)));
    }

    // テーブルリスト
    const tableList: string[] = tableColumns.getTables();
    // テーブル名と、列名と、ColumnElementのy座標値の配列
    const tableColumnYvalList: {tableName: string, columnName: string, y: number}[]
        = useMemo(
            ()=>tableList.map((t:string) => {
                const cols: string[] = tableColumns.getColumnsByTable(t);
                let accumYVal = 0;
                return cols.map((c: string, i: number)=>{
                    accumYVal += (i > 0)? (COLELM_ITEMS_PADDING + colElmsSize[i-1].height): 0;
                    return {tableName: t, columnName: c, y: accumYVal};
                });
            }).flat(),
            [colElmsSize]
        );

    // 自分のサイズを計算
    function getCurWidth() {
        return colElmsSize.reduce(
            (acc, curSize) => ((acc < curSize.width)? curSize.width: acc),
            0
        );
    }
    function getCurHeight() {
        return colElmsSize.reduce(
            (acc, curSize, i) => acc + ((i > 0)? COLELM_ITEMS_PADDING: 0) + curSize.height,
            0
        );
    }

    // この要素のサイズを通知
    useEffect(
        () => onSetSize(curSize),
        [colElmsSize]
    );


    return (
        <>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill="#f00"
            />
            {tableColumnYvalList.map((tc, i)=>(
                <g
                    key={`ColumnElementsBox_${i}`}
                    transform={`translate(0, ${tc.y})`}
                >
                    <ColumnElementBox
                        tableName={tc.tableName}
                        columnName={tc.columnName}
                        onSetSize={(sz: BoxSize) => handleOnSetSize(sz, i)}
                    />
                </g>
            ))}
        </>
    );
}
