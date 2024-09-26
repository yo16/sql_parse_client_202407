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
                console.log("CURRENT TEXT", text);
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

                // maxWidthに収まるlinesを作り、その最大幅 linesMaxWidth(padding込み) を得る
                const lines: string[] = [];
                let currentLine = '';
                let prevLine = '';
                let prevBBWidth: number = 0;
                let prevExceeded: boolean = true;   // 前回のループでwordを追加して超えたかどうか（超えて初期化されているかどうか）
                let linesMaxWidth: number = 0;  // 文字の幅だけで、paddingは含まない
                words.forEach((word) => {
                    console.log("WORDS!");
                    console.log(word);
                    console.log("currentLine", currentLine);
                    // wordを試しに１つ追加
                    const testCurrentLine: string
                        = (currentLine.length > 0) ? `${currentLine}.${word}`: word;
                    console.log("testCurrentLine", testCurrentLine);

                    // wordを追加してみたBBを取得
                    const curBB: DOMRect | null = getLineBB(testCurrentLine);
                    if (!curBB) return;
                    const curBBWidth: number = curBB.width;
                    console.log("curBBWidth", curBBWidth);
                    // 試しにwordを追加したら、maxWidthを超えたかどうか（何度か使うので変数化）
                    const exceededMaxWidth: boolean = (maxWidth < curBBWidth + rectPadding*2);   // 左右のpaddingも加える

                    // linesと、currentLineのメンテナンス
                    if (exceededMaxWidth) {
                        console.log("こえた");
                        // 超えた
                        // wordを加える前をlinesに入れ、
                        if (currentLine.length > 0) {   // １つ目で超えた場合の考慮
                            lines.push(currentLine);
                        }
                        // 次のcurrentLineにwordを入れる（２行目以降の場合は、"."を入れる）
                        if (currentLine.length > 0) {   // １つ目で超えた場合の考慮
                            currentLine = `.${word}`;
                        } else {
                            currentLine = word;
                        }
                    } else {
                        console.log("こえない");
                        // 超えていない
                        // 次のcurrentLineは、試しに入れた文字列から開始する
                        currentLine = testCurrentLine;
                    }

                    // linesMaxWidthのメンテナンス
                    // wordを試しに追加してみてmaxWidthを超えた場合
                    //     追加したwordが１つ目の場合は、今の幅でlineMaxWidthを更新する
                    //     追加したwordが２つ目以降の場合は、追加する前の幅でlineMaxWidthを更新する
                    // 超えていない場合
                    //     今の幅でlineMaxWidthを更新する   // <- 超えた時に更新するから、ここでは更新しなくていい
                    if (exceededMaxWidth) {
                        console.log("超えた部屋");
                        // 前回の幅で更新
                        console.log("更新！", (prevBBWidth + rectPadding*2));
                        linesMaxWidth = (linesMaxWidth < prevBBWidth + rectPadding*2)? (prevBBWidth + rectPadding*2): linesMaxWidth;
                        //if (prevExceeded) {
                        //    console.log("A");
                        //    // 前回超えた＝今回１つ目の単語、それでも超えた
                        //    // → 今の幅
                        //    linesMaxWidth = (linesMaxWidth < curBBWidth + rectPadding*2)? (curBBWidth + rectPadding*2): linesMaxWidth;
                        //} else {
                        //    console.log("B");
                        //    // 前回超えてない＝今回２つ目以降の単語、そこで超えた
                        //    // → 前回の幅
                        //    linesMaxWidth = (linesMaxWidth < prevBBWidth + rectPadding*2)? (prevBBWidth + rectPadding*2): linesMaxWidth;
                        //}
                        console.log("linesMaxWidth", linesMaxWidth);
                    }
                    
                    //if (exceededMaxWidth && !prevExceeded) {
                    //    console.log("A")
                    //    // maxWidthを超え、かつ、２つ目以降 → 前の幅
                    //    linesMaxWidth = (linesMaxWidth < prevBBWidth)? prevBBWidth: linesMaxWidth;
                    //} else {
                    //    console.log("B")
                    //    // else → 今の幅
                    //    linesMaxWidth = (linesMaxWidth < curBBWidth + rectPadding*2)? (curBBWidth + rectPadding*2): linesMaxWidth;
                    //}
                    // 前の幅(prevBBWidth)のメンテナンス
                    if (exceededMaxWidth) {
                        // 超えた
                        // 今回追加しようとしたものだけが入っている状態が前回となるが
                        // それはまだ計測していないので、改めて計測する
                        const curBB: DOMRect | null = getLineBB(currentLine);   // 今回追加しようとしたものだけが入っている
                        if (!curBB) return;
                        prevBBWidth = curBB.width;
                    } else {
                        // 超えていない
                        prevBBWidth = curBB.width;
                    }
                });
                console.log("ループ抜けた");
                console.log("linesMaxWidth", linesMaxWidth);
                // linesのメンテナンス
                // 無条件でcurrentLineをlinesへ追加
                console.log("currentLine", currentLine);
                lines.push(`${currentLine}`);
                // linesMaxWidthのメンテナンス
                const curBB: DOMRect | null = getLineBB(currentLine);
                if (!curBB) return;
                linesMaxWidth = (linesMaxWidth < curBB.width + rectPadding*2)? (curBB.width + rectPadding*2): linesMaxWidth;
                const oneLineHeight = curBB.height;
                console.log("おしまい");

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

