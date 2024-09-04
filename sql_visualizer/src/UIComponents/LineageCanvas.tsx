import { useState, useEffect, useMemo } from "react";
import { AST } from "node-sql-parser";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';


import { TableStruct } from "@QueryComponents/TableStruct";
import { TableStructQuery } from "@QueryComponents/TableStructQuery";
import { getTableStructQueryObj } from "@/QueryComponents/getTableStructQueryObj";
import { TableStructQueryBox } from "./CanvasComponents/TableStructQueryBox";
import { AST_PADDING } from "./CanvasComponents/constCanvasComponents";

import "./LineageCanvas.css";

interface LineageCanvasProps {
    astList: AST[];
}
function LineageCanvas({ astList }: LineageCanvasProps) {
    // SVG全体のサイズ
    const [svgWidth, setSvgWidth] = useState<number>(550);
    const [svgHeight, setSvgHeight] = useState<number>(400);

    // astそれぞれのサイズ
    const [astWidths, setAstWidths] = useState<number[]>([]);
    const [astHeights, setAstHeights] = useState<number[]>([]);

    // keyで使用するタイムスタンプ文字列
    // astListが変わるたびに、過去のコンポーネント（子たちを含む））破棄させるために、keyにタイムスタンプを埋める
    const drawTimestamp: string = useMemo(
        () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const millisconds = String(now.getMilliseconds()).padStart(4, '0');

            return `${year}${month}${day}_${hours}${minutes}${seconds}_${millisconds}`;
        },
        [astList]
    );

    // デフォルトの幅は平等、高さは元の高さのまま
    useEffect(() => {
        // 幅は、左右とast同士の隙間を除いて、等分
        setAstWidths(astList.map(()=>(svgWidth - AST_PADDING*2 - AST_PADDING*(astList.length-1))/(astList.length)));
        setAstHeights(astList.map(()=>(svgHeight-AST_PADDING*2)));
    }, [astList]);

    // ASTから、TableStructQueryへ変換
    const tableStructs: TableStruct[] = useMemo(
        () => {
            const queries: (TableStructQuery | null)[] = astList.map((ast) => getTableStructQueryObj(ast));
            const queriesNotNull : TableStructQuery[] = queries.filter((q) => q!==null);
            return queriesNotNull;
        },
        [astList]
    );

    function handleOnSetSize(w: number, h: number, i: number) {
        astWidths[i] = w;
        setAstWidths([...astWidths]);
        astHeights[i] = h;
        setAstHeights([...astHeights]);

        // svgのwidthは、全部のwidthとその間のpadding + 両サイドのpadding
        const newSvgWidth: number
            = AST_PADDING + astWidths.reduce((acc, w) => acc + w + AST_PADDING, 0);
        // svgのheightは、全部のheightの最大 + 上下のpadding
        const newSvgHeight: number
            = astHeights.reduce((acc, h) => (acc < h)? h: acc, 0)
            + AST_PADDING*2;

        setSvgWidth(newSvgWidth);
        setSvgHeight(newSvgHeight);
    }

    
    return (
        <div
            className="lineage-canvas-container"
        >
            <TransformWrapper
                minScale={0.1}
            >
                <TransformComponent>
                    <svg width={svgWidth} height={svgHeight} style={{backgroundColor: "#dde"}} >
                    {/* <svg width={550} height={400} style={{backgroundColor: "#dde"}} > */}
                    {/* <svg width={550} height={svgHeight} style={{backgroundColor: "#dde"}} > */}
                    {/* 固定か可変、どちらがいいかまだ検討不十分。 */}
                    {tableStructs.map((ts: TableStruct, i: number) => {
                        if (ts instanceof TableStructQuery) {
                            return (
                                <g
                                    key={`G_TableStructQueryBox_${drawTimestamp}_${i}`}
                                    transform={`translate(${AST_PADDING + astWidths.slice(0, i).reduce((acc, w) => acc + w + AST_PADDING, 0)}, ${AST_PADDING})`}
                                >
                                    <TableStructQueryBox
                                        tsq={ts as TableStructQuery}
                                        onSetSize={(w: number, h: number) => {handleOnSetSize(w, h, i)}}
                                    />
                                </g>
                            );
                        }
                        {/* TableStructTable の場合が入る予定 */}
                    })}
                    </svg>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}

export { LineageCanvas };
