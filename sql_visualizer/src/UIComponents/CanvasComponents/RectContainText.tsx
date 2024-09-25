// svgのtextとそれを包含するrect
// textをスペースの位置で改行して、maxWidth内に収める

import { useLayoutEffect, useRef } from "react";

import { BoxSize } from "./types";
import "./commonSvgStyles.css";

interface RectContainTextProps {
    text: string;
    fontSize: number;
    x: number;
    y: number;
    minWidth: number;
    maxWidth: number;
    // サイズの変更後、フィードバックする
    onSetSize: (newSize: BoxSize) => void;
    rectPadding?: number;
    strokeWidth?: number;
}
export const RectContainText: React.FC<RectContainTextProps> = ({
    text,
    fontSize,
    x,
    y,
    minWidth,
    maxWidth,
    onSetSize,
    rectPadding = 5,
    strokeWidth = 1,
}) => {
    const textRef = useRef<SVGTextElement>(null);
    const rectRef = useRef<SVGRectElement>(null);

    // 描画の直前にtextを解析して、<text>、<rect>を書き換える
    useLayoutEffect(
        () => {
            // text
            let rectSize: {width: number, height: number} = {width: 0, height: 0};
            if (textRef.current) {
                // textをピリオド区切りで配列にする
                const words: string[] = text.split(".");

                // 折り返しの１行目（textの１つ目）にlineを入れてみて、
                // BounderyBoxを取得する
                const getLineBB = (line: string): DOMRect | null => {
                    if (textRef.current) {
                        textRef.current.textContent = line;
                        const bb = textRef.current.getBBox();
                        return bb;
                    }
                    return null;
                }

                // maxWidthに収まるlinesを作る
                const lines: string[] = [];
                let currentLine = '';
                let linesMaxWidth: number = 0;  // 文字の幅だけで、paddingは含まない
                console.log("11");
                words.forEach((word) => {
                    console.log("word", word);
                    console.log("currentLine", currentLine);
                    // wordを１つ追加
                    const testCurrentLine: string
                        = (currentLine.length > 0) ? `${currentLine}.${word}`: word;
                    console.log("testCurrentLine", testCurrentLine);

                    // textを入れてみたBBを取得
                    const curBB: DOMRect | null = getLineBB(testCurrentLine);
                    if (!curBB) return;
                    if (curBB.width <= maxWidth + rectPadding*2) {  // 両サイドのpaddingも考慮
                        // 超えていない
                        console.log("超えてない");
                        currentLine = testCurrentLine;
                        linesMaxWidth = (linesMaxWidth < curBB.width)? curBB.width: linesMaxWidth;
                    } else {
                        console.log("超えた", currentLine);
                        // 超えている
                        if (currentLine.length > 0) {
                            // wordを加える前をlinesに入れ、
                            lines.push(currentLine);
                            // 次のcurrentLineにwordを入れる（２行目以降の場合は、"."を入れる）
                            currentLine = `.${word}`;
                        } else {
                            // currentLineが空の、１行目からtestで超えた場合
                            // 今のcurrentLineは登録せず、currentLineにwordを入れておく（次のループで追加される）
                            currentLine = word;
                            // 最大幅を更新しておく
                            linesMaxWidth = (linesMaxWidth < curBB.width)? curBB.width: linesMaxWidth;
                        }
                    }
                });
                console.log("999");
                console.log("currentLine", currentLine);
                lines.push(`${currentLine}`);
                const curBB: DOMRect | null = getLineBB(currentLine);
                if (!curBB) return;
                linesMaxWidth = (linesMaxWidth < curBB.width)? curBB.width: linesMaxWidth;
                const oneLineHeight = curBB.height;

                // textRefを直接変更
                // 一旦すべて削除
                textRef.current.textContent = "";
                textRef.current.innerHTML = "";
                // 子要素としてtspanを作成して追加
                const svgNS = "http://www.w3.org/2000/svg";
                lines.forEach((line) => {
                    const tspanElement = document.createElementNS(svgNS, "tspan");
                    tspanElement.setAttribute("x", `${x + rectPadding}`);
                    tspanElement.setAttribute("dx", "0");
                    tspanElement.setAttribute("dy", `${oneLineHeight}`);
                    tspanElement.textContent = line;
                    
                    textRef.current?.appendChild(tspanElement);
                });

                // rectのために情報を渡す
                linesMaxWidth += rectPadding * 2;
                rectSize = {
                    width: (linesMaxWidth < minWidth)? minWidth: linesMaxWidth,
                    height: oneLineHeight * lines.length + rectPadding * 2,
                };
            }

            // rect
            if (rectRef.current) {
                const newWidth = rectSize.width;
                const newHeight = rectSize.height;

                rectRef.current.setAttribute("width", `${newWidth}`);
                rectRef.current.setAttribute("height", `${newHeight}`);

                onSetSize({
                    width: newWidth,
                    height:newHeight,
                } as BoxSize);
            }
        },
        [text, fontSize, minWidth, maxWidth]
    );

    return (
        <g
            className="rectContainText"
        >
            <rect
                ref={rectRef}
                x={x}
                y={y}
                width={0}
                height={0}
                className="bg"
                strokeWidth={strokeWidth}
            />
            <text
                ref={textRef}
                x={x + rectPadding}
                y={y + rectPadding}
                dominantBaseline={"text-after-edge"}
                fontSize={fontSize}
                className="rext-text"
            ></text>
        </g>
    );
}

