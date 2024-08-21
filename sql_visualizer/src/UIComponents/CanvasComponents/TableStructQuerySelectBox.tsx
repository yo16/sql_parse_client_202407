import { useState, useEffect } from "react";

import { QuerySelect } from "@/QueryComponents/QuerySelect";
import { ClauseWithsBox } from "./ClauseWithsBox";
import { ClauseFromsBox } from "./ClauseFromsBox";
import { ClauseColumnsBox } from "./ClauseColumnsBox";
import {
    CLAUSE_HEADER_HEIGHT, QUERY_ITEMS_PADDING, FROM_WIDTH, COLUMN_WIDTH, INITIAL_HEIGHT
} from "./constCanvasComponents";

interface TableStructQuerySelectBoxProps {
    select: QuerySelect;
    onSetSize: (w: number, h: number) => void;
}
export function TableStructQuerySelectBox({
    select,
    onSetSize,
}: TableStructQuerySelectBoxProps) {
    // SelectBox全体のサイズ
    const [curWidth, setCurWidth] = useState<number>(FROM_WIDTH + COLUMN_WIDTH + QUERY_ITEMS_PADDING*3);
    const [curHeight, setCurHeight] = useState<number>(CLAUSE_HEADER_HEIGHT  + QUERY_ITEMS_PADDING*2);

    // with句、from句、columnそれぞれのサイズ
    const [withsWidth, setWithsWidth] = useState<number>(0);
    const [withsHeight, setWithsHeight] = useState<number>(0);
    const [fromsWidth, setFromsWidth] = useState<number>(FROM_WIDTH);
    const [fromsHeight, setFromsHeight] = useState<number>(INITIAL_HEIGHT);
    const [columnsWidth, setColumnsWidth] = useState<number>(COLUMN_WIDTH);
    const [columnsHeight, setColumnsHeight] = useState<number>(INITIAL_HEIGHT);

    // with、from、columnの各々のサイズから、全体のサイズを計算してsetSizeを呼び出す
    useEffect(() => {
        // 幅：３つのアイテム＋アイテム間の隙間(2)＋左右の隙間(2)
        const newWidth: number
            = QUERY_ITEMS_PADDING
            + ((select.withs.length > 0)? (withsWidth + QUERY_ITEMS_PADDING): 0)
            + fromsWidth + QUERY_ITEMS_PADDING
            + columnsWidth + QUERY_ITEMS_PADDING;
        // 高さ：最大の高さ＋上下の隙間(2)
        const newHeight: number
            = Math.max(withsHeight, fromsHeight, columnsHeight)
            + QUERY_ITEMS_PADDING * 2;
        
        setCurWidth(newWidth);
        setCurHeight(newHeight);
        onSetSize(
            newWidth,
            newHeight
        );
    }, [
        select,
        withsWidth, fromsWidth, columnsWidth,
        withsHeight, fromsHeight, columnsHeight,
    ]);

    function handleOnSetWithsSize(w: number, h: number) {
        setWithsWidth(w);
        setWithsHeight(h);
    }
    function handleOnSetFromsSize(w: number, h: number) {
        setFromsWidth(w);
        setFromsHeight(h);
    }
    function handleOnSetColumnsSize(w: number, h: number) {
        setColumnsWidth(w);
        setColumnsHeight(h);
    }


    const fromsStartX: number =
        ((select.withs.length === 0)? 0: withsWidth) +
        QUERY_ITEMS_PADDING*((select.withs.length === 0)? 1: 2)
    ;
    const columnsStartX: number =
        ((select.withs.length === 0)? 0: withsWidth) +
        fromsWidth +
        QUERY_ITEMS_PADDING*((select.withs.length === 0)? 2: 3)
    ;
    return (
        <>
            {/* Query全体の枠 */}
            <rect
                x={0}
                y={0}
                width={curWidth}
                height={curHeight}
                rx={5}
                ry={5}
                fill={"#dee"}
                stroke={"#999"}
                strokeWidth={0.5}
            />

            {/* Withs */}
            {/*
            <g
                transform={`translate(${QUERY_ITEMS_PADDING}, ${QUERY_ITEMS_PADDING})`}
                name="WithsBoxGroup"
            >
                <ClauseWithsBox
                    clauseWiths={select.withs}
                    onSetSize={handleOnSetWithsSize}
                />
            </g>
            */}
            
            {/* Froms */}
            {/*
            <g transform={`translate(${fromsStartX}, ${QUERY_ITEMS_PADDING})`}>
                <ClauseFromsBox
                    clauseFroms={select.froms}
                    onSetSize={handleOnSetFromsSize}
                />
            </g>
            */}

            {/* Columns */}
            <g transform={`translate(${columnsStartX}, ${QUERY_ITEMS_PADDING})`}>
                <ClauseColumnsBox
                    clauseColumns={select.columns}
                    onSetSize={handleOnSetColumnsSize}
                />
            </g>
        </>
    );
}
