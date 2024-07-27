import { useState, useEffect } from "react";
import { AST } from "node-sql-parser";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';


import { TableStruct } from "@QueryComponents/TableStruct";
import { TableStructQuery, getTableStructQueryObj } from "@QueryComponents/TableStructQuery";
import { TableStructQueryBox } from "./CanvasComponents/TableStructQueryBox";

import "./LineageCanvas.css";

const AST_PADDING: number = 10;

interface LineageCanvasProps {
    astList: AST[];
}
function LineageCanvas({ astList }: LineageCanvasProps) {
    const [svgWidth, setSvgWidth] = useState<number>(550);
    const [svgHeight, setSvgHeight] = useState<number>(400);
    const [astWidths, setAstWidths] = useState<number[]>([]);
    const [astHeights, setAstHeights] = useState<number[]>([]);
    const [tableStruts, setTableStructs] = useState<TableStruct[]>([] as TableStruct[]);

    // デフォルトの幅は平等、高さは元の高さのまま
    useEffect(() => {
        // 幅は、左右とast同士の隙間を除いて、等分
        setAstWidths(astList.map(()=>(svgWidth - AST_PADDING*2 - AST_PADDING*(astList.length-1))/(astList.length)));
        setAstHeights(astList.map(()=>(svgHeight-AST_PADDING*2)));
    }, []);

    // ASTから、TableStructQueryへ変換
    // 元のtableStrutsは初期化される
    useEffect(() => {
        const tmpTableStructsQueryList: TableStructQuery[] = [];
        astList.forEach((ast) => {
            const tsq: TableStructQuery | null = getTableStructQueryObj(ast);
            if (tsq) {
                tmpTableStructsQueryList.push(tsq);
            }
        });
        setTableStructs(tmpTableStructsQueryList);
    }, [astList])
    

    // astListのi番目の要素のサイズが変更された際のハンドラ
    function handleSetWidth(w: number, i: number) {
        astWidths[i] = w;
        setAstWidths(astWidths);

        // svgのwidthは、全部のwidthとその間のpadding、両サイドのpaddingを足した結果
        setSvgWidth(AST_PADDING + astWidths.reduce((acc, w) => acc + w + AST_PADDING, 0));
    }
    function handleSetHeight(h: number, i: number) {
        astHeights[i] = h;
        setAstHeights(astHeights);

        // svgのheightは、全部のheightの最大
        setSvgHeight(astHeights.reduce((acc, h) => (acc < h)? h: acc, svgHeight));
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
                    {tableStruts.map((ts: TableStruct, i: number) => {
                        if (ts instanceof TableStructQuery) {
                            return (
                                <TableStructQueryBox
                                    key={`TableStructQueryBox_${i}`}
                                    tsq={ts as TableStructQuery}
                                    x={AST_PADDING + astWidths.slice(0, i).reduce((acc, w) => acc + w + AST_PADDING, 0)}
                                    y={AST_PADDING}
                                    width={astWidths[i]}
                                    height={astHeights[i]}
                                    setWidth={(w: number)=>{handleSetWidth(w, i)}}
                                    setHeight={(h: number)=>{handleSetHeight(h, i)}}
                                />
                            );
                        }
                    })}
                    </svg>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
                        /*
                        <SqlAst
                            key={`SqlAst_${i}`}
                            ast={ast}
                            x={AST_PADDING + astWidths.slice(0, i).reduce((acc, w) => acc + w + AST_PADDING, 0)}
                            y={AST_PADDING}
                            width={astWidths[i]}
                            height={astHeights[i]}
                            setWidth={(w: number)=>{handleSetWidth(w, i)}}
                            setHeight={(h: number)=>{handleSetHeight(h, i)}}
                        />
                        */

export { LineageCanvas };
