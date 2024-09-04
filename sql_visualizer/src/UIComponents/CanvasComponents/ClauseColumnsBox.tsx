import { useState, useEffect, useMemo } from "react";

import { ClauseColumns } from "@/QueryComponents/ClauseColumns";
import { ClauseColumnBox } from "./ClauseColumnBox";

import type { BoxSize } from "./types";
import {
    COLUMN_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT, COLUMN_NAME_HEIGHT, INCOLUMNS_ITEMS_PADDING
} from "./constCanvasComponents";
import { arraysEqual, getTextPosByHeight } from "./commonFunctions";


function initializeColumnsSize(colCount: number): BoxSize[] {
    return new Array(colCount).fill({width: 0, height: 0});
}

interface ClauseColumnsBoxProps {
    clauseColumns: ClauseColumns;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseColumnsBox({
    clauseColumns,
    onSetSize,
}: ClauseColumnsBoxProps) {
    // columnsBox全体のサイズ
    //const [curWidth, setCurWidth] = useState<number>(width: COLUMN_WIDTH + INCLAUSE_ITEMS_PADDING*2);
    //const [curHeight, setCurHeight] = useState<number>(CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2);
    //const [curSize, setCurSize] = useState<{width: number, height: number}>(
    //    {
    //        width: COLUMN_WIDTH + INCLAUSE_ITEMS_PADDING*2,
    //        height: CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2
    //    }
    //)

    // column要素群(ClauseColumnBox)の各々のサイズ
//    const [columnWidths, setColumnWidths] = useState<number[]>([]);
//    const [columnHeights, setColumnHeights] = useState<number[]>([]);
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

    //// clauseColumnsが変わったら、配列要素数が変わるため、再定義する
    //useEffect(() => {
    //    setColumnsSize(initializeColumnsSize(clauseColumns.columnCount));
    //}, [clauseColumns]);

//    // 最終的に描画したcolumn句
//    const curClauseColumns = useRef<ClauseColumns | null>(null);

//    useEffect(()=>{
//        // 全体のサイズを計算してonSetSizeを呼ぶ
//        // widthはfromWidthの最大値
//        const wholeWidth: number = (
//            (columnWidths.length > 0)? Math.max(...columnWidths): COLUMN_WIDTH
//        ) + INCLAUSE_ITEMS_PADDING * 2;
//        // heightはすべてのfromの合計＋隙間
//        const wholeHeight: number = columnHeights.reduce((acc, h, i) => {
//            return acc + ((i>0)? INCOLUMN_ITEMS_PADDING: 0) + h;
//        }, CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2);  // "column"のヘッダーと上下
//
//        setCurWidth(wholeWidth);
//        setCurHeight(wholeHeight);
//        onSetSize(wholeWidth, wholeHeight);
//    }, [clauseColumns, columnWidths, columnHeights]);
    
//    // 初期化
//    function initializeValues(newColumns: ClauseColumns) {
//        // columnWidths, columnHeihtsを初期化
//        const initialColumnWidths: number[] = newColumns.columns.map((_) => COLUMN_WIDTH);
//        if (!arraysEqual(columnWidths, initialColumnWidths)) {
//            setColumnWidths(initialColumnWidths);
//        }
//        const initialColumnHeights: number[] = newColumns.columns.map((_) => COLUMN_NAME_HEIGHT);
//        if (!arraysEqual(columnHeights, initialColumnHeights)) {
//            setColumnHeights(initialColumnHeights);
//        }
//    }
    function handleOnSetSize(newSize: BoxSize, i: number) {
        setColumnsSize((colsSize) => colsSize.map((cs, j) => ((i===j)? newSize: cs)));
        //const newCols = columnsSize.map((cs, j) => ((i===j)? newSize: cs));
        //console.log(newCols);
        //setColumnsSize(newCols);
    }

    // 自分のサイズを計算
    function getCurWidth() {
        return columnsSize.reduce(
            (acc, sz) => ((acc < sz.width)? sz.width: acc),
            COLUMN_WIDTH
        );
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

//    function handleOnSetSize(w: number, h: number, i: number) {
//        // ローカルのuseState値を更新
//        columnWidths[i] = w;
//        setColumnWidths([...columnWidths]);
//
//        // ローカルのuseState値を更新
//        columnHeights[i] = h;
//        setColumnHeights([...columnHeights]);
//    }
//
//    // column句が変わった場合に、初期化
//    // ただし描画の前で実行する必要があるため、タイミングの遅いフックは使えない
//    if (curClauseColumns.current !== clauseColumns) {   // インスタンスの比較
//        initializeValues(clauseColumns);
//        curClauseColumns.current = clauseColumns;
//    }

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
