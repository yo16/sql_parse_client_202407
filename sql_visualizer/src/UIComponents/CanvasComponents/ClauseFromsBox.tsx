import { useState, useMemo, useEffect } from "react";

import { ClauseFroms } from "@/QueryComponents/ClauseFroms";
import { ClauseFromBox } from "./ClauseFromBox";

import { BoxSize } from "./types";

import { FROM_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight, initializeBoxSizes } from "./commonFunctions";

import "./commonSvgStyles.css";

interface ClauseFromsBoxProps {
    clauseFroms: ClauseFroms;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseFromsBox({
    clauseFroms,
    onSetSize,
}: ClauseFromsBoxProps) {
    // from要素群(ClauseFromBox)の各々のサイズ
    const [fromSizes, setFromSizes] = useState<BoxSize[]>(
        () => initializeBoxSizes(clauseFroms.fromCount)
    );

    // FromsBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            const curWidth = getCurWidth();
            const curHeight = getCurHeight();

            return {
                width: curWidth,
                height: curHeight,
            };
        },
        [fromSizes]
    );

    // 自分のサイズを計算
    function getCurWidth(): number {
        const curWidth: number
            = fromSizes.reduce(
                (accWidth, curSize) => ((accWidth < curSize.width)? curSize.width: accWidth),
                FROM_WIDTH
            ) + INCLAUSE_ITEMS_PADDING*2;   // 左右
        return curWidth;
    }
    function getCurHeight(): number {
        const curHeight: number
            = fromSizes.reduce(
                (accHeight, curSize, i) => {
                    return accHeight
                        + ((i>0)? INCLAUSE_ITEMS_PADDING: 0)
                        + curSize.height;
                },
                CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2 // "from"のヘッダーと上下
            );
        return curHeight;
    }

    // fromSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [fromSizes]
    );

    // サイズが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize, i: number) {
        setFromSizes(
            (fromSizes) => fromSizes.map((fs, j) => ((i===j)? newSize: fs))
        );
    }

    return (
        <g
            className="fromsBox"
        >
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                className="bg"
            />
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={CLAUSE_HEADER_HEIGHT}
                className="clause-header-bg"
            />
            <text
                {...(getTextPosByHeight(CLAUSE_HEADER_HEIGHT))}
                className="clause-header-text"
            >
                from
            </text>
            {clauseFroms.froms.map((f, from_i) => {
                // x位置
                const xPos: number = INCLAUSE_ITEMS_PADDING;
                // y位置
                let yPos: number = CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING;
                for (let i=0; i<from_i; i++) {
                    yPos += INCLAUSE_ITEMS_PADDING + fromSizes[i].height;
                }

                return (
                    <g
                        key={`G_from_${from_i}`}
                        transform={`translate(${xPos}, ${yPos})`}
                        name={`Froms-${from_i}`}
                    >
                        <ClauseFromBox
                            clauseFrom={f}
                            onSetSize={(newSize) => handleOnSetSize(newSize, from_i)}
                        />
                    </g>
                );
            })}
        </g>
    );
}
