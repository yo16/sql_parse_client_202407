/*
ClauseWithsBox

- With句群の表示関数
- 参照関係がある＝親子関係がある場合は、最も右の親の列の、ひとつ右の列にする
- 同じ列内では、上に詰める
- つまり１つのwithは、参照深さ(右方向)の座標と、同じ深さ内の表示順(下方向)の座標の２つを持ち、WithPostionで記憶する
- その情報は、WithPositionManagerで管理する

*/

import { useState, useEffect, useRef } from "react";

import { ClauseWiths, ClauseWith } from "@/QueryComponents/ClauseWiths";
import { ClauseWithBox } from "./ClauseWithBox";

import { WITH_WIDTH, INITIAL_HEIGHT, INCLAUSE_ITEMS_PADDING } from "./constCanvasComponents";


interface ClauseWithsBoxProps {
    clauseWiths: ClauseWiths;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseWithsBox({
    clauseWiths,
    width,
    height,
    onSetSize
}: ClauseWithsBoxProps) {
    const [withWidths, setWithWidths] = useState<number[]>(clauseWiths.withs.map((_) => WITH_WIDTH));
    const [withHeights, setWithHeights] = useState<number[]>(clauseWiths.withs.map((_) => INITIAL_HEIGHT));
    const posManager = useRef<WithPositionManager | null>(null);

    useEffect(() => {
        // WithPositionManagerを初期化
        posManager.current = new WithPositionManager();
        clauseWiths.withs.forEach((w) => {
            // clauseWithsのindexのまま登録
            posManager.current?.addWithClause();
        });

        // width、heightを初期化
        setWithWidths(clauseWiths.withs.map((_) => WITH_WIDTH));
        setWithHeights(clauseWiths.withs.map((_) => INITIAL_HEIGHT));
    }, [clauseWiths]);

    // with句が変わったときと、各々のwithの幅・高さが変わったとき、全体を再計算
    useEffect(() => {
        // 全体の幅と高さを計算
        const wholeWidth: number = calcWholeWidth();
        const wholeHeight: number = calcWholeHeight();

        onSetSize(wholeWidth, wholeHeight);
    }, [clauseWiths, withWidths, withHeights])

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(w: number, h: number, i: number) {
        // ローカルのuseState値を更新
        console.log("widthが変わったよ WithsBox", w);
        withWidths[i] = w;
        
        // ローカルのuseState値を更新
        withHeights[i] = h;
        setWithHeights([...withHeights]);
    }

    // 全体の幅を計算して通知
    function calcWholeWidth(): number {
        // depthごとの最大幅から、全体の幅を計算
        const wholeWidth: number
            = Array
                .from({ length: posManager.current? posManager.current.maxDepth+1: 0 }, (_,i)=>i)
                .reduce((accumWidth: number, curDepthIndex: number) =>
                    {
                        if (!posManager.current) return accumWidth;

                        // 今のdepth内にあるwithのindexリスト
                        const withIndexesInCurDepth: number[] = posManager.current.getWithIndexesInCurDepth(curDepthIndex);

                        // 今のdepthの最大の幅
                        const maxWidthInCurDepth: number = Math.max(
                            ...(
                                clauseWiths.withs.filter(
                                    (_, i) => withIndexesInCurDepth.includes(i)
                                ).map(
                                    (_, i) => withWidths[i]
                                )
                            )
                        );

                        return accumWidth + ((curDepthIndex>0)? INCLAUSE_ITEMS_PADDING: 0) + maxWidthInCurDepth;
                    },
                    0
                )
            ;
        return wholeWidth;
    }

    // 全体の高さを計算して通知
    function calcWholeHeight(): number {
        // depthごとの最大値を使用
        const wholeHeight: number
            = Array
                .from({ length: posManager.current? posManager.current.maxDepth+1: 0 }, (_,i)=>i)
                .reduce((maxHeight: number, curDepthIndex: number) =>
                    {
                        if (!posManager.current) return maxHeight;

                        // 今のdepth内にあるwithのindexリスト
                        const withIndexesInCurDepth: number[] = posManager.current.getWithIndexesInCurDepth(curDepthIndex);

                        // 今のdepthのheightの合計
                        const curDepthHeight: number
                            = clauseWiths.withs
                                .filter(
                                    (_, i) => withIndexesInCurDepth.includes(i)
                                )
                                .reduce(
                                    (accumHeight, _, i) => accumHeight + ((i>0)? INCLAUSE_ITEMS_PADDING: 0) + withHeights[i],
                                    0
                                )
                            ;

                        // 大きかったら更新
                        return (maxHeight < curDepthHeight)? curDepthHeight: maxHeight;
                    },
                    0
                )
            ;
        return wholeHeight;
    }

    let xPos: number = 0;
    let nextXPos: number = 0;
    let maxWidthInCurDepth: number = 0;
    let yPos: number = 0;
    let nextYPos: number = 0;
    return (
        <>
            {posManager && Array.from(
                { length: posManager.current? posManager.current.maxDepth+1: 0 }, (_,i) => i
            ).map((curDepthIndex: number) => { // depthごとのループ
                if (!posManager.current) return (<></>);

                // 前のループで計算したnextXPosを設定
                xPos = nextXPos;

                // 今のdepth内にあるwithのindexリスト
                const withIndexesInCurDepth: number[] = posManager.current.getWithIndexesInCurDepth(curDepthIndex);

                // 今のdepthの最大の幅
                maxWidthInCurDepth = Math.max(
                    ...(
                        clauseWiths.withs.filter(
                            (_, i) => withIndexesInCurDepth.includes(i)
                        ).map(
                            (_, i) => withWidths[i]
                        )
                    )
                );

                // 次のxPos
                nextXPos = xPos + maxWidthInCurDepth + INCLAUSE_ITEMS_PADDING;

                // yPosを初期化
                yPos = 0;
                nextYPos = 0;

                return (
                    <g
                        key={`G_WithDepth_${curDepthIndex}`}
                        transform={`translate(${xPos}, ${0})`}
                    >
                        {withIndexesInCurDepth.map((withIndex: number) => {     // depth内のwithごとのループ
                            // 前のループで計算したnextYPosを設定
                            yPos = nextYPos;

                            // 次のyPos
                            nextYPos = yPos + withHeights[withIndex] + INCLAUSE_ITEMS_PADDING;

                            // １つのwithを描画
                            return (
                                <g
                                    key={`G_WithBox_${withIndex}`}
                                    transform={`translate(${0}, ${yPos})`}
                                >
                                    <ClauseWithBox
                                        clauseWith={clauseWiths.withs[withIndex]}
                                        width={withWidths[withIndex]}
                                        height={withHeights[withIndex]}
                                        onSetSize={(w, h) => handleOnSetSize(w, h, withIndex)}
                                    />
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </>
    );
}



// with句の表示位置を管理するオブジェクト
// with句の中身には関与せず、indexでのみ管理する
class WithPositionManager {
    // 現在管理しているidの最大値
    withIndex: number;

    // withの位置をindexで管理する
    // １次元目がdepth、２次元目が同じdepth内の順序
    withPositions: number[][];

    // 親のindex
    parentIndexes: number[][];

    // 親のうち、一番深いdepth
    // 自分はこのdepth+1の深さになる
    parentsDeepestDepth: number[];


    constructor() {
        this.withIndex = -1;
        this.withPositions = [];
        this.parentIndexes = [];
        this.parentsDeepestDepth = [];
    }

    // depthIndexの最大値を返す
    get maxDepth() {
        return this.withPositions.length-1;
    }
    getWithIndexesInCurDepth(depthIndex: number) {
        return this.withPositions[depthIndex];
    };
    getWithIndex(depthIndex: number, orderIndex: number): number {
        return this.withPositions[depthIndex][orderIndex];
    }

    // withの中身は関与せず、indexでのみ位置を把握するため
    // ここでは引数にClauseWithなどの要素を受けない
    addWithClause(): number {
        if (this.withPositions.length === 0) {
            this.withPositions.push([]);
        }

        // 初期は一番左の一番下
        const newIndex: number = ++this.withIndex;
        this.withPositions[0].push(newIndex);

        // 親indexの配列要素を追加（初期は空）
        this.parentIndexes.push([]);

        // 親の、最も深い深さ
        this.parentsDeepestDepth.push(-1);

        return newIndex;
    }

    // withIndexがどこにあるか返す
    searchWith(withIndex: number): {depth: number, order: number} | null {
        for(let i = 0; i < this.withPositions.length; i++) {
            for(let j = 0; j < this.withPositions[i].length; j++) {
                if (this.withPositions[i][j] === withIndex) {
                    return {depth: i, order: j};
                }
            }
        }
        return null;
    }

    // 自分の子（自分を親としているwithIndex）を返す
    getChildren(withIndex: number): number[] {
        let childrenIds: number[] = [];
        for (let i=0; i<this.parentIndexes.length; i++) {
            if (this.parentIndexes[i].includes(withIndex)) {
                childrenIds.push(i);
            }
        }
        return childrenIds;
    }

    // 親を申告する
    // この結果、親より右の位置へ移動する
    // 移動する対象は、自分自身と、自分の子たち
    public declareParent(withIndex: number, parentWithIndex: number): void {
        // 未登録の番号の場合は、何もしない（不正）
        if (this.withIndex < parentWithIndex) {
            return;
        }

        // すでに親として登録済の場合は、何もしない
        if (this.parentIndexes[withIndex].includes(parentWithIndex)) {
            return;
        }

        // 親の今の位置を取得
        const parentPos: {depth: number, order: number} | null = this.searchWith(parentWithIndex);
        if (!parentPos) {
            // 取得できなかったら、何もしない
            return;
        }
        
        // 子の位置を更新
        this.updateChildrenPos(withIndex, parentPos.depth);
    }

    // wtihIndexの子の位置を、depthより深く設定
    updateChildrenPos(curWithIndex: number, parentDepth: number): void {
        // 今の位置が、指定した深さより深い場合は、何もしない
        if (parentDepth <= this.parentsDeepestDepth[curWithIndex]) {
            return;
        }

        // 自分のdepth（parentsDeepestDepth）を更新
        this.parentsDeepestDepth[curWithIndex] = parentDepth;

        // 自分の子を取得
        const childrenIds = this.getChildren(curWithIndex);

        // 子を自分のdepthより深く設定
        childrenIds.forEach((id: number) => {
            this.updateChildrenPos(id, parentDepth+1);
        });
    }
}
