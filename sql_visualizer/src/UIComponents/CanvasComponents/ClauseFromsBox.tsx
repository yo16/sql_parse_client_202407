import { useState, useEffect, useRef } from "react";

import { ClauseFroms } from "@/QueryComponents/ClauseFroms";
import { ClauseFromBox } from "./ClauseFromBox";

import { CLAUSE_HEADER_HEIGHT, INITIAL_HEIGHT, INCLAUSE_ITEMS_PADDING, FROM_WIDTH } from "./constCanvasComponents";
import { arraysEqual, getTextPosByHeight } from "./commonFunctions";

interface ClauseFromsBoxProps {
    clauseFroms: ClauseFroms;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseFromsBox({
    clauseFroms,
    width,
    height,
    onSetSize,
}: ClauseFromsBoxProps) {
    const [fromWidths, setFromWidths] = useState<number[]>([]);
    const [fromHeights, setFromHeights] = useState<number[]>([]);
    const curClauseFroms = useRef<ClauseFroms | null>(null);

    useEffect(()=>{
        // 全体のサイズを計算してonSetSizeを呼ぶ
        // widthはfromWidthの最大値
        const wholeWidth: number = (fromWidths.length > 0)? Math.max(...fromWidths)+INCLAUSE_ITEMS_PADDING*2: FROM_WIDTH;
        // heightはすべてのfromの合計＋隙間
        const wholeHeight: number = fromHeights.reduce((acc, h, i) => {
            return acc + ((i>0)? INCLAUSE_ITEMS_PADDING: 0) + h;
        }, CLAUSE_HEADER_HEIGHT) + INCLAUSE_ITEMS_PADDING*2;  // 上下

        onSetSize(wholeWidth, wholeHeight);
    }, [clauseFroms, fromWidths, fromHeights]);

    function handleOnSetSize(w: number, h: number, i: number) {
        // ローカルのuseState値を更新
        fromWidths[i] = w;
        setFromWidths([...fromWidths]);

        // ローカルのuseState値を更新
        fromHeights[i] = h;
        setFromHeights([...fromHeights]);
    }

    // 初期化
    function initializeValues() {
        setFromWidths(clauseFroms.froms.map((f)=>FROM_WIDTH));
        setFromHeights(clauseFroms.froms.map((f)=>INITIAL_HEIGHT));
    }

    // from句が変わった場合に、初期化
    // ただし描画の前で実行する必要があるため、タイミングの遅いフックは使えない
    if (curClauseFroms.current !== clauseFroms) {   // インスタンスの比較
        initializeValues();
        curClauseFroms.current = clauseFroms;
    }

    return (
        <>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={"#0f0"}
            />
            
            <rect
                x={0}
                y={0}
                width={width}
                height={CLAUSE_HEADER_HEIGHT}
                fill={"#fff"}
            />
            <text
                {...(getTextPosByHeight(CLAUSE_HEADER_HEIGHT))}
                fontStyle={"italic"}
                fill={"#f00"}
            >
                from
            </text>

            {clauseFroms.froms.map((f, i)=>{
                // iより上のfrom句の累計 + INCLAUSE_ITEMS_PADDING
                let yPos: number = CLAUSE_HEADER_HEIGHT;
                for(let j=0; j<i; j++) {
                    yPos += INCLAUSE_ITEMS_PADDING;
                    yPos += fromHeights[j];
                }
                yPos += INCLAUSE_ITEMS_PADDING;
                return (
                    <g
                        key={`G_FromBox_${i}`}
                        transform={`translate(${INCLAUSE_ITEMS_PADDING}, ${yPos})`}
                        name={`FromBox-${i}`}
                    >
                        <ClauseFromBox
                            clauseFrom={f}
                            width={fromWidths[i]}
                            height={fromHeights[i]}
                            onSetSize={(w, h)=>handleOnSetSize(w, h, i)}
                        />
                    </g>
                )
            })}
        </>
    );
}
