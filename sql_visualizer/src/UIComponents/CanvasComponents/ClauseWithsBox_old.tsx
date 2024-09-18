/*
ClauseWithsBox

- With句群の表示関数

- With句群は次の性質がある
    - With句群は、複数のWith句(実体はSelect句)によってなっている
    - また複数のWith句は、いずれかのWith句(複数)を参照していることがある
    - 参照されているWith句を親、しているWith句を子と呼ぶ
    - どのWith句も参照していない場合は、最上位の親
    - 参照するテーブル名が、クエリ内のテーブル名にない場合は、解析中のクエリの外の実テーブルを参照している

- この性質のWith句群を描画するために、まず解析して親子関係を明確にする
    - 入力引数の「clauseWiths: ClauseWiths」は、すべてのWith句（ClauseWith型）がflatな配列になっている
    - 解析はSQL文の先頭から行う
    - 参照するテーブル名が、解析済みのテーブル名にない場合は、解析中のクエリの外の実テーブルを参照している
    - 参照するテーブル名が、解析済みのテーブル名にある場合は、その解析済みテーブルの子となる
    - 親(参照するテーブル)が複数あり、親の階層が異なる場合、子は最下層の親の下の階層になる

- 物理設計
    - AllWithsクラス
        - 概要
            - With句を１つ追加すると、参照元のテーブル名群を得る
            - 参照元テーブルが含まれるGroupedWithsの最下層の親の次の階層の、GroupedWithsに追加される
        - プロパティ
            - GroupedWithsクラスの配列
                - indexの小さい方が上位
        - メソッド
            - With句を追加する
            - With句を解析する
            - グループ数を返す
            - i番目のグループを返す
    - GroupedWithsクラス
        - 概要
            - 同じ階層のWith句群をまとめたもの




- 参照関係がある＝親子関係がある場合は、最も右の親の列の、ひとつ右の列にする
- 同じ列内では、上に詰める
- つまり１つのwithは、参照深さ(右方向)の座標と、同じ深さ内の表示順(下方向)の座標の２つを持ち、WithPostionで記憶する
- その情報は、WithPositionManagerで管理する

*/

import { useState, useEffect, useRef, useMemo } from "react";

import { ClauseWiths } from "../../QueryComponents/ClauseWiths";
import { ClauseWithBox } from "./ClauseWithBox";
import { BoxSize } from "./types";

import { WITH_WIDTH, INITIAL_HEIGHT, INCLAUSE_ITEMS_PADDING, CLAUSE_HEADER_HEIGHT } from "./constCanvasComponents";

import { arraysEqual, getTextPosByHeight } from "./commonFunctions";

function initializeWithsSize(withsCount: number): BoxSize[] {
    return new Array(withsCount).fill({width: 0, height: 0});
}

interface ClauseWithsBoxProps {
    clauseWiths: ClauseWiths;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseWithsBox({
    clauseWiths,
    onSetSize
}: ClauseWithsBoxProps) {
    //// WithsBox全体のサイズ
    //const [curWidth, setCurWidth] = useState<number>(WITH_WIDTH + INCLAUSE_ITEMS_PADDING*2);
    //const [curHeight, setCurHeight] = useState<number>(CLAUSE_HEADER_HEIGHT + INCLAUSE_ITEMS_PADDING*2);

    // with要素群(ClauseWithBox)の各々のサイズ
    //const [withWidths, setWithWidths] = useState<number[]>([]);
    //const [withHeights, setWithHeights] = useState<number[]>([]);
    const [withsSize, setWithsSize] = useState<BoxSize[]>(
        () => initializeWithsSize(clauseWiths.length)
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
        [withsSize]
    );

    //// 最終的に描画したwith句
    //const curClauseWiths = useRef<ClauseWiths | null>(null);

//    // with句が変わったときと、各々のwithの幅・高さが変わったとき、全体を再計算
//    useEffect(() => {
//        // 全体の幅と高さを計算
//        const wholeWidth: number = calcWholeWidth();
//        const wholeHeight: number = calcWholeHeight();
//
//        setCurWidth(wholeWidth);
//        setCurHeight(wholeHeight);
//        onSetSize(wholeWidth, wholeHeight);
//    }, [withsSize]);

    // withsSizeが変わった場合は、呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [withsSize]
    );

    // 現在のサイズを取得
    function getCurWidth() {
        return WITH_WIDTH;
    }
    function getCurHeight() {
        return 0;
    }


//    // WithBox群の管理オブジェクト
//    const posManager = useRef<WithPositionManager | null>(null);

//    // WithPositionManagerを作り直す（with句が変わったタイミングでのみ呼び出される想定）
//    function setWithPositionManager() {
//        // WithPositionManagerを初期化
//        posManager.current = new WithPositionManager();
//        clauseWiths.withs.forEach((_) => {
//            // clauseWithsのindexのまま登録
//            posManager.current?.addWithClause();
//        });
//
//        // withWidths、withHeightsを初期化
//        const initialWithWidth: number[] = clauseWiths.withs.map((_) => WITH_WIDTH);
//        if (!arraysEqual(withWidths, initialWithWidth)) {
//            setWithWidths(initialWithWidth);
//        }
//        const initialWithHeight: number[] = clauseWiths.withs.map((_) => INITIAL_HEIGHT);
//        if (!arraysEqual(withHeights, initialWithHeight)) {
//            setWithHeights(initialWithHeight);
//        }
//    }

/*
    // 全体の幅を計算（純粋な関数で、変数などは変更しない）
    function calcWholeWidth(): number {
        // depthごとの最大幅から、全体の幅を計算
        const widthDeptLen: number = posManager.current? (posManager.current.maxDepth + 1): 0;

        const wholeWidth: number
            = Array
                .from({ length: widthDeptLen }, (_,i)=>i)
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
            + ((widthDeptLen>0)? INCLAUSE_ITEMS_PADDING*2: 0)    // 左右
            ;
        return wholeWidth;
    }

    // 全体の高さを計算（純粋な関数で、変数などは変更しない）
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
            + INCLAUSE_ITEMS_PADDING*2 + ((clauseWiths.withs.length > 0)? CLAUSE_HEADER_HEIGHT: 0)    // 上下 + ヘッダー
            ;
        return wholeHeight;
    }
*/

    // width, heightが変わったときのハンドラ
    function handleOnSetSize(newSize: BoxSize, i: number) {
        //// ローカルのuseState値を更新
        //withWidths[i] = w;
        //setWithWidths([...withWidths]);
        //
        //// ローカルのuseState値を更新
        //withHeights[i] = h;
        //setWithHeights([...withHeights]);
        
        setWithsSize((wSize) => wSize.map((ws, j) => ((i===j)? newSize: ws)));
    }

    //// with句が変わった場合のみ、withPositionManagerを更新する
    //// ただし描画の前で実行する必要があるため、タイミングの遅いフックは使えない
    //if (curClauseWiths.current !== clauseWiths) {   // インスタンスの比較
    //    setWithPositionManager();
    //    curClauseWiths.current = clauseWiths;
    //}

    return (
            <g
                key={`G_WithDepth_${0}`}
                transform={`translate(${0}, ${0})`}
                name={`GroupDepth-${0}`}
            >
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
            </g>
    );

/*
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
                        name={`GroupDepth-${curDepthIndex}`}
                    >
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

                        {withIndexesInCurDepth.map((withIndex: number) => {     // depth内のwithごとのループ
                            // 前のループで計算したnextYPosを設定
                            yPos = nextYPos;

                            // 次のyPos
                            nextYPos = yPos + withHeights[withIndex] + INCLAUSE_ITEMS_PADDING;

                            // １つのwithを描画
                            return (
                                <g
                                    key={`G_WithBox_${withIndex}`}
                                    transform={`translate(${INCLAUSE_ITEMS_PADDING}, ${INCLAUSE_ITEMS_PADDING+CLAUSE_HEADER_HEIGHT+yPos})`}
                                    name={`WithBox-${withIndex}`}
                                >
                                    <ClauseWithBox
                                        clauseWith={clauseWiths.withs[withIndex]}
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
    */
}


/*
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
*/
