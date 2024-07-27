import { useState, useEffect } from "react";

import { QuerySelect } from "@/QueryComponents/QuerySelect";
import { ClauseWithsBox } from "./ClauseWithsBox";
import { ClauseFromsBox } from "./ClauseFromsBox";
import { ClauseColumnsBox } from "./ClauseColumnsBox";
import { QUERY_ITEMS_PADDING, WITH_WIDTH, FROM_WIDTH, COLUMN_WIDTH, INITIAL_HEIGHT } from "./constCanvasComponents";

interface TableStructQuerySelectBoxProps {
    select: QuerySelect;
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
export function TableStructQuerySelectBox({
    select,
    width,
    height,
    setWidth,
    setHeight,
}: TableStructQuerySelectBoxProps) {
    const [withsWidth, setWithsWidth] = useState<number>(WITH_WIDTH);
    const [withsHeight, setWithsHeight] = useState<number>(INITIAL_HEIGHT);
    const [fromsWidth, setFromsWidth] = useState<number>(FROM_WIDTH);
    const [fromsHeight, setFromsHeight] = useState<number>(INITIAL_HEIGHT);
    const [columnsWidth, setColumnsWidth] = useState<number>(COLUMN_WIDTH);
    const [columnsHeight, setColumnsHeight] = useState<number>(INITIAL_HEIGHT);

    // with、from、columnの各々の幅から、全体の幅を計算してsetWidthを呼び出す
    useEffect(() => {
        // ３つのアイテム＋アイテム間の隙間(2)＋左右の隙間(2)
        setWidth(withsWidth + fromsWidth + columnsWidth + QUERY_ITEMS_PADDING*4);
    }, [withsWidth, fromsWidth, columnsWidth]);
    // with、from、columnの各々の高さから、全体の高さを計算してsetHeightを呼び出す
    useEffect(() => {
        // 最大の高さ＋上下の隙間(2)
        setHeight(Math.max(withsHeight, fromsHeight, columnsHeight) + QUERY_ITEMS_PADDING*2);
    }, [withsHeight, fromsHeight, columnsHeight]);


    return (
        <>
            {/* Query全体の枠 */}
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                rx={5}
                ry={5}
                fill={"#dee"}
                stroke={"#999"}
                strokeWidth={0.5}
            />

            {/* Withs */}
            <g transform={`translate(${QUERY_ITEMS_PADDING}, ${QUERY_ITEMS_PADDING})`}>
                <ClauseWithsBox
                    withs={select.withs}
                    width={withsWidth}
                    height={withsHeight}
                    setWidth={setWithsWidth}
                    setHeight={setWithsHeight}
                />
            </g>
            
            {/* Froms */}
            <g transform={`translate(${withsWidth + QUERY_ITEMS_PADDING*2}, ${QUERY_ITEMS_PADDING})`}>
                <ClauseFromsBox
                    froms={select.froms}
                    width={fromsWidth}
                    height={fromsHeight}
                    setWidth={setFromsWidth}
                    setHeight={setFromsHeight}
                />
            </g>

            {/* Columns */}
            <g transform={`translate(${withsWidth + fromsWidth + QUERY_ITEMS_PADDING*3}, ${QUERY_ITEMS_PADDING})`}>
                <ClauseColumnsBox
                    columns={select.columns}
                    width={columnsWidth}
                    height={columnsHeight}
                    setWidth={setColumnsWidth}
                    setHeight={setColumnsHeight}
                />
            </g>
        </>
    );
}
