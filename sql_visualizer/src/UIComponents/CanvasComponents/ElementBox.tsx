// column、from共通の、ElementBox
// ElementsBoxの中で、親としても子としても利用する

import { useEffect, useMemo } from "react";

import { COLUMN_WIDTH, COLELM_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";
import { BoxSize } from "./types";

import "./commonSvgStyles.css";

interface ElementBoxProps {
    name: string;
    onSetSize: (newBox: BoxSize) => void;
}
export function ElementBox({
    name,
    onSetSize,
}: ElementBoxProps) {
    // この要素のサイズ
    const curSize: BoxSize = useMemo(
        ()=>({width: COLUMN_WIDTH, height: COLELM_HEIGHT}),
        []
    );

    // この要素のサイズは変わらないので、初回だけ、親へ通知
    useEffect(
        () => onSetSize(curSize),
        []
    );

    return (
        <g
            className="elementBox"
        >
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                className="bg"
            />
            <text
                {...getTextPosByHeight(COLELM_HEIGHT)}
                className="element-text"
            >
                {name}
            </text>
        </g>
    )
}

