import { useState, useEffect, useMemo } from "react";

import { ClauseWithsGroupBox } from "./ClauseWithsGroupBox";
import { WithsManager } from "./withClauseTools/WithsManager";
import { BoxSize } from "./types";

import { WITH_WIDTH, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";

interface ClauseWithsBoxProps {
    withsManager: WithsManager,
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseWithsBox({
    withsManager,
    onSetSize
}: ClauseWithsBoxProps) {
    // WithsGroupの各々のサイズ
    const [withsGroupSizes, setWithsGroupSizes] = useState<BoxSize[]>(
        () => initializeWithsSize(withsManager.withsGroupList.length)
    );

    // WithsBox全体のサイズ
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
        [withsGroupSizes]
    );

    // 現在のサイズを取得
    function getCurWidth(): number {
        // これまでのwithsGroupの幅＋今回の隙間＋今回の幅
        const curWidth = withsGroupSizes.reduce(
            (accWidth, curWgSize, i) => {
                const nextSize: number
                    = accWidth
                    + ((i===0)? 0: INCLAUSE_ITEMS_PADDING)
                    + curWgSize.width;
                return nextSize;
            },
            INCLAUSE_ITEMS_PADDING*2   // 初期値は、withsGroupの両サイドの隙間
        );

        // 最低限WITH_WIDTHはある
        return Math.max(curWidth, WITH_WIDTH);
    }
    function getCurHeight(): number {
        // 最大のwithsGroupの高さを求め、そこに上下の隙間を加える
        const curHeight = withsGroupSizes.reduce(
            (accHeight: number, curWgSize) => {
                return Math.max(accHeight, curWgSize.height);
            },
            0
        )
        + INCLAUSE_ITEMS_PADDING*2 + CLAUSE_HEADER_HEIGHT;  // withsGroupの高さに、withsGroupの上下の隙間＋ヘッダーを加える

        // 最低限CLAUSE_HEADER_HEIGHTはある
        return Math.max(curHeight, CLAUSE_HEADER_HEIGHT);
    }
    
    // withsGroupSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [withsGroupSizes]
    );

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize, i: number) {
        setWithsGroupSizes((wSize) => wSize.map((ws, j) => ((i===j)? newSize: ws)));
    }

    return (
        <g>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#f00"}
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
                with
            </text>
            {withsManager.withsGroupList.map(
                (wg, wg_i) => {
                    // x位置
                    let xPos: number = INCLAUSE_ITEMS_PADDING;
                    for (let i=0; i<wg_i; i++) {   // 今のwg_iの手前まで
                        xPos += withsGroupSizes[i].width + INCLAUSE_ITEMS_PADDING;
                    }
                    // y位置
                    const yPos: number = CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING;
                    return (
                        <g
                            key={`G_WithsGroup_${wg_i}`}
                            transform={`translate(${xPos}, ${yPos})`}
                            name={`WithsGroup-${wg_i}`}
                        >
                            <ClauseWithsGroupBox
                                withsGroupManager={wg}
                                onSetSize={(newSize) => handleOnSetSize(newSize, wg_i)}
                            />
                        </g>
                    );
                }
            )}
        </g>
    );
}

function initializeWithsSize(withsGroupCount: number): BoxSize[] {
    return new Array(withsGroupCount).fill({width: 0, height: 0});
}
