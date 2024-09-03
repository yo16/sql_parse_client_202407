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
    // この要素のサイズ
    const [curSize, setCurSize] = useState<BoxSize>({width: 0, height: 0});
    // ColumnElement要素たちのサイズ
    const [colElmsSize, setColElmnsSize]
        = useState<BoxSize[]>(
            () => new Array(tableColumns.columnCount).fill({width:0, height:0})
        );
    
    // i番目のサイズ変更時のハンドル
    function handleOnSetSize(newBoxSize: BoxSize, i: number) {
        setColElmnsSize((elmsSize) => elmsSize.map((sz: BoxSize, j: number) => (i===j ? newBoxSize: sz)));
    }

    // テーブルリスト
    const tableList: string[] = tableColumns.getTables();
    // テーブル名と、列名と、ColumnElementのy座標値の配列
    let accumYVal = 0;
    const tableColumnYvalList: {tableName: string, columnName: string, y: number}[]
        = useMemo(
            ()=>tableList.map((t:string) => {
                const cols: string[] = tableColumns.getColumnsByTable(t);
                return cols.map((c: string, i: number)=>{
                    accumYVal += ((i > 0)? COLELM_ITEMS_PADDING: 0) + colElmsSize[i].height;
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

    useEffect(() => {
        const newCurWidth: number = getCurWidth();
        const newCurHeight: number = getCurHeight();

        // statusを更新
        setCurSize({
            width: newCurWidth,
            height: newCurHeight
        });

        // この要素のサイズを通知
        onSetSize({
            width: newCurWidth,
            height: newCurHeight
        });
    }, [colElmsSize]);


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
                    transform={`transform(0, ${tc.y})`}
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
