
import { useState, useMemo, useEffect } from "react";

import { WithInfo } from "./withClauseTools/WithInfo";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";
import { BoxSize } from "./types";

interface ClauseWithBoxProps {
    withInfo: WithInfo;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseWithBox({
    withInfo,
    onSetSize,
}: ClauseWithBoxProps) {
    // withの中に描画するselect要素のサイズ
    const [selectSize, setSelectSize] = useState<BoxSize>({
        width: 0,
        height: 0,
    });

    // WithBox全体のサイズ
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
        [selectSize]
    );

    // 現在のサイズを取得
    function getCurWidth(): number {
        return selectSize.width;
    }
    function getCurHeight(): number {
        return selectSize.height;
    }

    // selectSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [selectSize]
    );

    // selectのwidth, heightが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize) {
        onSetSize(newSize);
    }

    return (
        <g>
            <TableStructQuerySelectBox
                select={withInfo.selectObj}
                onSetSize={handleOnSetSize}
            />
        </g>
    );
}
