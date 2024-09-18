import { useState, useMemo, useEffect } from "react";

import { WithsGroupManager } from "./withClauseTools/WithsGroupManager";
import { ClauseWithBox } from "./ClauseWithBox";
import { BoxSize } from "./types";
import { WITH_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT } from "./constCanvasComponents";

interface ClauseWithsGroupBoxProps {
    withsGroupManager: WithsGroupManager,
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseWithsGroupBox({
    withsGroupManager,
    onSetSize
}: ClauseWithsGroupBoxProps) {
    // WithBoxの各々のサイズ
    const [withSizes, setWithSizes] = useState<BoxSize[]>(
        () => initializeWithSize(withsGroupManager.withList.length)
    );

    // WithsGroupBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            // 全体の幅と高さを計算
            const curWidth: number = getCurWidth();
            const curHeight: number = getCurHeight();
    
            return {
                width: curWidth,
                height: curHeight
            };
        },
        [withSizes]
    );

    // 現在のサイズを取得
    function getCurWidth(): number {
        // 最大のwidthに、左右の隙間を加える
        const curWidth: number = withSizes.reduce(
            (accWidth: number, curWithSize) => {
                return Math.max(accWidth, curWithSize.width)
            },
            0
        )
        + INCLAUSE_ITEMS_PADDING*2;

        return Math.max(curWidth, WITH_WIDTH);
    }
    function getCurHeight(): number {
        // withの高さの合計＋今回の隙間＋今回の高さ
        const curHeight = withSizes.reduce(
            (accHeight: number, curWithSize) => {
                const nextHeight: number
                    = accHeight
                    + INCLAUSE_ITEMS_PADDING
                    + curWithSize.height;
                
                return nextHeight;
            },
            0
        ) + INCLAUSE_ITEMS_PADDING; // 下の隙間

        return curHeight;
    }
    
    // withsGroupSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [withSizes]
    );

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize, i: number) {
        setWithSizes((wSize) => wSize.map((ws, j) => ((i===j)? newSize: ws)));
    }

    return (
        <g>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#f66"}
            />
            {withsGroupManager.withList.map(
                (w, w_i) => {
                    // x位置
                    const xPos: number = INCLAUSE_ITEMS_PADDING;
                    // y位置
                    let yPos: number = INCLAUSE_ITEMS_PADDING;
                    for (let i=0; i<w_i; i++) {
                        yPos += withSizes[i].height + INCLAUSE_ITEMS_PADDING;
                    }

                    return (
                        <g
                            key={`G_With_${w_i}`}
                            transform={`translate(${xPos}, ${yPos})`}
                            name={`With-${w_i}`}
                        >
                            <ClauseWithBox
                                withInfo={w}
                                onSetSize={(newSize) => handleOnSetSize(newSize, w_i)}
                            />
                        </g>
                    )
                }
            )}
        </g>
    );
}

function initializeWithSize(withCount: number): BoxSize[] {
    return new Array(withCount).fill({width: 0, height: 0});
}