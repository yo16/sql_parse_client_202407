import { useState, useMemo, useEffect } from "react";

import { TableStructQuery } from "@/QueryComponents/TableStructQuery";
import { ClauseFrom } from "@/QueryComponents/ClauseFroms";
import { BoxSize } from "./types";

import { FROM_WIDTH, FORM_NAME_HEIGHT, INCLAUSE_ITEMS_PADDING } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";
import { TableStructQueryBox } from "./TableStructQueryBox";

interface ClauseFromBoxProps {
    clauseFrom: ClauseFrom;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseFromBox({
    clauseFrom,
    onSetSize,
}: ClauseFromBoxProps) {
    const [tsqSize, setTsqSize] = useState<BoxSize>({
        width: 0,
        height: 0,
    });

    // FromBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            // 全体の幅と高さを計算
            const curWidth: number = getCurWidth();
            const curHeight: number = getCurHeight();

            return {
                width: curWidth,
                height: curHeight,
            };
        },
        [tsqSize]
    );

    // 現在のサイズを取得
    function getCurWidth(): number {
        const curWidth: number
            = tsqSize.width + INCLAUSE_ITEMS_PADDING*2;

        return Math.max(curWidth, FROM_WIDTH);
    }
    function getCurHeight(): number {
        const curHeight: number
            = FORM_NAME_HEIGHT
            + tsqSize.height
            + ((tsqSize.height>0)? (INCLAUSE_ITEMS_PADDING*2): 0);

        return curHeight;
    }

    // tsqSizeが変わったときは、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [tsqSize]
    );

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(newWidth: number, newHeight: number) {
        setTsqSize({
            width: newWidth,
            height: newHeight,
        });
    }


    return (
        <g>
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                fill={"#fdb"}
            />
            <text
                {...(getTextPosByHeight(FORM_NAME_HEIGHT))}
                fill={"#f00"}
            >
                {(clauseFrom.db)?`${clauseFrom.db}.`:''}{clauseFrom.tableName}
            </text>
            {(clauseFrom.tableStruct instanceof TableStructQuery) && ((() => {
                const xPos: number = INCLAUSE_ITEMS_PADDING;
                const yPos: number = INCLAUSE_ITEMS_PADDING;
                return (
                    <g
                        transform={`translate(${xPos}, ${yPos})`}
                    >
                        <TableStructQueryBox
                            tsq={clauseFrom.tableStruct}
                            onSetSize={handleOnSetSize}
                        />
                    </g>
                );
            })())}
        </g>
    );
}
