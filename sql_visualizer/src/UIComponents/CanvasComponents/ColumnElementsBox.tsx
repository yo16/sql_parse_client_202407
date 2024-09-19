import { useState, useEffect, useMemo } from "react";

import { TableColumns } from "@/QueryComponents/TableColumns";
import { ColumnElementBox } from "./ColumnElementBox";

import type { BoxSize } from "./types";
import { COLELM_ITEMS_PADDING } from "./constCanvasComponents";
import { initializeBoxSizes } from "./commonFunctions";

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
    const [colElmSizes, setColElmSizes] = useState<BoxSize[]>(
        () => initializeBoxSizes(tableColumns.columnCount)
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
        [colElmSizes]
    );

    // 自分のサイズを計算
    function getCurWidth() {
        // elementの最大に、左右のパディングを追加
        const curWidth: number
            = colElmSizes.reduce(
                (acc, curSize) => ((acc < curSize.width)? curSize.width: acc),
                0
            ) + COLELM_ITEMS_PADDING*2;   // 左右
        return curWidth;
    }
    function getCurHeight() {
        // elementの合計＋それぞれのパディングに、下のパディングを追加
        const curHeight: number
            = colElmSizes.reduce(
                (acc, curSize) => acc + COLELM_ITEMS_PADDING + curSize.height,
                0
            ) + COLELM_ITEMS_PADDING;
        return curHeight;
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
                    accumYVal += (i > 0)? (COLELM_ITEMS_PADDING + colElmSizes[i-1].height): 0;
                    return {tableName: t, columnName: c, y: accumYVal};
                });
            }).flat(),
            [colElmSizes]
        );

    // この要素のサイズを通知
    useEffect(
        () => onSetSize(curSize),
        [colElmSizes]
    );
    
    // i番目のサイズ変更時のハンドル
    function handleOnSetSize(newBoxSize: BoxSize, i: number) {
        setColElmSizes((elmsSize) => elmsSize.map((sz: BoxSize, j: number) => ((i===j)? newBoxSize: sz)));
    }


    return (
        <>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill="#339"
            />
            {tableColumnYvalList.map((tc, tc_i)=>{
                const xPos: number = COLELM_ITEMS_PADDING;
                let yPos: number = COLELM_ITEMS_PADDING;
                for (let i=0; i<tc_i; i++) {
                    yPos += COLELM_ITEMS_PADDING + colElmSizes[i].height;
                }

                return (
                    <g
                        key={`ColumnElementsBox_${tc_i}`}
                        transform={`translate(${xPos}, ${yPos})`}
                    >
                        <ColumnElementBox
                            tableName={tc.tableName}
                            columnName={tc.columnName}
                            onSetSize={(sz: BoxSize) => handleOnSetSize(sz, tc_i)}
                        />
                    </g>
                );
            })}
        </>
    );
}
