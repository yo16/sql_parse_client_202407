import { useState, useEffect, useMemo } from "react";

import { QuerySelect } from "@/QueryComponents/QuerySelect";
import { ClauseWithsBox } from "./ClauseWithsBox";
import { ClauseFromsBox } from "./ClauseFromsBox";
import { ClauseColumnsBox } from "./ClauseColumnsBox";
import {
    CLAUSE_HEADER_HEIGHT, QUERY_ITEMS_PADDING, FROM_WIDTH, COLUMN_WIDTH, INITIAL_HEIGHT
} from "./constCanvasComponents";

import { BoxSize } from "./types";

interface TableStructQuerySelectBoxProps {
    select: QuerySelect;
    onSetSize: (newSize: BoxSize) => void;
}
export function TableStructQuerySelectBox({
    select,
    onSetSize,
}: TableStructQuerySelectBoxProps) {
    // with句、from句、columnそれぞれのサイズ
    const [withsSize, setWithsSize] = useState<BoxSize>({width: 0, height: 0});
    const [fromsSize, setFromsSize] = useState<BoxSize>({width: FROM_WIDTH, height: INITIAL_HEIGHT});
    const [columnsSize, setColumnsSize] = useState<BoxSize>({width: COLUMN_WIDTH, height: INITIAL_HEIGHT});

    // SelectBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            // 幅：３つのアイテム＋アイテム間の隙間(2)＋左右の隙間(2)
            const newWidth: number
                = QUERY_ITEMS_PADDING
                + ((select.withs.length > 0)? (withsSize.width + QUERY_ITEMS_PADDING): 0)
                + fromsSize.width + QUERY_ITEMS_PADDING
                + columnsSize.width + QUERY_ITEMS_PADDING;
            // 高さ：最大の高さ＋上下の隙間(2)
            const newHeight: number
                = Math.max(withsSize.height, fromsSize.height, columnsSize.height)
                + QUERY_ITEMS_PADDING * 2;
            
            return {
                width: newWidth,
                height: newHeight,
            };
        },
        [withsSize, fromsSize, columnsSize,]
    )

    // with、from、columnの各々のサイズから、全体のサイズを上位コンポーネントへ通知
    useEffect(
        () => onSetSize(curSize),
        [withsSize, fromsSize, columnsSize,]
    );

    function handleOnSetWithsSize(newSize: BoxSize) {
        setWithsSize(newSize);
    }
    function handleOnSetFromsSize(newSize: BoxSize) {
        setFromsSize(newSize);
    }
    function handleOnSetColumnsSize(newSize: BoxSize) {
        setColumnsSize(newSize);
    }


    const fromsStartX: number =
        ((select.withs.length === 0)? 0: withsSize.width) +
        QUERY_ITEMS_PADDING*((select.withs.length === 0)? 1: 2)
    ;
    const columnsStartX: number =
        ((select.withs.length === 0)? 0: withsSize.width) +
        fromsSize.width +
        QUERY_ITEMS_PADDING*((select.withs.length === 0)? 2: 3)
    ;

    return (
        <>
            {/* Query全体の枠 */}
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
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
            <g
                transform={`translate(${columnsStartX}, ${QUERY_ITEMS_PADDING})`}
                name={`TableStructQuerySelectBox`}
            >
                <ClauseColumnsBox
                    clauseColumns={select.columns}
                    onSetSize={handleOnSetColumnsSize}
                />
            </g>
        </>
    );
}
