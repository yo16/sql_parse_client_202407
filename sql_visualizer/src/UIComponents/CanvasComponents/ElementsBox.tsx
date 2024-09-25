// column、from共通の、ElementsBox
//
// - columnの場合は１つの列、fromの場合は１つのテーブルを表す。
// - AS によってリネームされたり、複数の列で１つの列を構成するなど
//   親が1～n、子が0 or 1の２階層を包含するBOXを表現する。
// - 親が元の情報、子がasなどによって変更された情報の意味である。
//   したがって、親の方が情報量が多い。
// - 親・子とも、それ自体は、ElementBoxで表現する。
//   つまり、ElementBoxが1～nの下に、ElementBoxが１つ存在するか存在しない。
// - childrenを指定した場合は、parentNamesを無視して、それを親のElementBoxの代わりとする。
// - 呼び出し元は、"children"に、親要素を指定する。名前が混乱しがちなので注意。


import React, { useState, ReactElement, useMemo, useEffect } from "react";

//import { ElementBox } from "./ElementBox";
import { RectContainText } from "./RectContainText";

import { BoxSize } from "./types";
//import { INCLAUSE_ITEMS_PADDING, ELM_INDENT_WIDTH, ELM_ITEMS_PADDING } from "./constCanvasComponents";
import { ELM_INDENT_WIDTH, ELM_ITEMS_PADDING, ELM_HEIGHT, ELM_MIN_WIDTH, ELM_MAX_WIDTH } from "./constCanvasComponents";
import { initializeBoxSizes, getFontSizeByHeight } from "./commonFunctions";

import "./commonSvgStyles.css";

interface ElementsBoxProps {
    parentNames: string[];
    childName: string;
    onSetSize: (newBox: BoxSize) => void;
    children?: React.ReactNode;     // Reactの用語のchildrenという変数の中に、アプリケーションの用語のparentが入っている！
}
export function ElementsBox({
    parentNames,
    childName,
    onSetSize,
    children,
}: ElementsBoxProps) {
    // 親のElementBoxのサイズ
    const [parentBoxSizes, setParentBoxSizes] = useState<BoxSize[]>(
        () => initializeBoxSizes(children? React.Children.count(children): parentNames.length)
    );
    // 子のElementBoxのサイズ
    const [childBoxSize, setChildBoxSize] = useState<BoxSize>({width: 0, height: 0});
    
    // ElementsBox全体のサイズ
    const curSize: BoxSize = useMemo(
        () => {
            const curWidth = getCurWidth();
            const curHeight = getCurHeight();
            
            return {
                width: curWidth,
                height: curHeight,
            };
        },
        [parentBoxSizes, childBoxSize]
    );

    // 自分のサイズを計算
    function getCurWidth(): number {
        // すべての親の幅と、インデント込みの子の幅の最大を取得
        const maxWidth: number = Math.max(
            ...(parentBoxSizes.map((parentBoxSize) => parentBoxSize.width)),
            ELM_INDENT_WIDTH + childBoxSize.width
        );
        // 左右のpaddingを加える
        return maxWidth + ELM_ITEMS_PADDING*2;
    }
    function getCurHeight(): number {
        // 親の高さ＝アイテムの上のpadding＋アイテムの高さ
        const accumulatedParentHeight: number = parentBoxSizes.reduce(
            (acc, curSize, i) => acc + ((i > 0)? ELM_ITEMS_PADDING: 0) + curSize.height,
            0
        );
        // 子の高さと、親との隙間（隙間の幅は、子がない場合はゼロ）
        const childHeight: number = childBoxSize.height
            + ((childBoxSize.height > 0)? ELM_ITEMS_PADDING: 0);
        // 親＋子＋上下の隙間
        return accumulatedParentHeight
            + childHeight
            + ELM_ITEMS_PADDING*2;
    }

    // parentBoxSizes, childBoxSizeが変わった場合は、再計算した自分のサイズを呼び出し元へ通知
    useEffect(
        () => onSetSize(curSize),
        [parentBoxSizes, childBoxSize]
    );

    // サイズが変わったときのハンドラ
    function handleOnSetSizeParentsWH(width: number, height: number, i: number) {
        handleOnSetSizeParents({width, height}, i);
    }
    function handleOnSetSizeParents(newSize: BoxSize, i: number) {
        setParentBoxSizes(
            (sizes) => sizes.map((sz, j) => ((i===j)? newSize: sz))
        );
    }
    function handleOnSetSizeChild(newSize: BoxSize) {
        setChildBoxSize(newSize);
    }

    return (
        <g
            className="elementsBox"
        >
            <rect
                x={0}
                y={0}
                width={curSize.width}
                height={curSize.height}
                className="bg"
            />

            {/* 親 */}
            {children ? (
                <>{/* Reactのchildrenが指定されている場合は、その要素を親とする */}
                {React.Children.map(children, (parent, parent_i) => {     // 親が入っているので、変数名は"parent"にする
                    const xPos: number = ELM_ITEMS_PADDING;
                    let yPos: number = 0;
                    for (let i=0; i<parent_i; i++) {
                        yPos += ELM_ITEMS_PADDING + parentBoxSizes[i].height;
                    }
                    yPos += ELM_ITEMS_PADDING;
                    return (
                        <g
                            key={`G_parent1_${parent_i}`}
                            transform={`translate(${xPos}, ${yPos})`}
                            name={`G_parent1_${parent_i}`}
                        >
                            {((p: any, i: number) => {
                                if (React.isValidElement(p)) {
                                    // parentがReactElementのときのみ、onSetSizeをつける
                                    // （ReactElementしかないはず）
                                    return React.cloneElement(p as ReactElement, {
                                        onSetSize: (w:number, h:number) => handleOnSetSizeParentsWH(w, h, i)
                                    });
                                }
                                return parent;
                            })(parent, parent_i)}
                        </g>
                    );
                })}
                </>
            ) : (
                <>{/* Reactのchildrenが指定されていない場合は、parentNamesから親要素を作成する */}
                {parentNames.map((parentName: string, parent_i) => {
                    const xPos: number = ELM_ITEMS_PADDING;
                    let yPos: number = ELM_ITEMS_PADDING;
                    for (let i=0; i<parent_i; i++) {
                        yPos += ELM_ITEMS_PADDING + parentBoxSizes[i].height;
                    }
                    return (
                        <g
                            key={`G_parent2_${parent_i}`}
                            transform={`translate(${xPos}, ${yPos})`}
                            name={`G_parent2_${parent_i}`}
                        >
                            {/*
                            <ElementBox
                                name={parentName}
                                onSetSize={(newSize) => handleOnSetSizeParents(newSize, parent_i)}
                            />
                            */}
                           <RectContainText
                                text={parentName}
                                fontSize={getFontSizeByHeight(ELM_HEIGHT)}
                                x={0}
                                y={0}
                                minWidth={ELM_MIN_WIDTH}
                                maxWidth={ELM_MAX_WIDTH}
                                onSetSize={(newSize) => handleOnSetSizeParents(newSize, parent_i)}
                           />
                        </g>
                    );
                })}
                </>
            )}

            {/* 子 */}
            {(childName.length > 0) && (
                <g
                    transform={
                        "translate("
                        + `${ELM_ITEMS_PADDING + ELM_INDENT_WIDTH}, `
                        + `${curSize.height - (ELM_ITEMS_PADDING + childBoxSize.height)}`
                        + ")"
                    }
                >
                    {/*
                    <ElementBox
                        name={childName}
                        onSetSize={handleOnSetSizeChild}
                    />
                    */}
                        <RectContainText
                            text={childName}
                            fontSize={getFontSizeByHeight(ELM_HEIGHT)}
                            x={0}
                            y={0}
                            minWidth={ELM_MIN_WIDTH}
                            maxWidth={ELM_MAX_WIDTH}
                            onSetSize={handleOnSetSizeChild}
                        />
                </g>
            )}
        )
        </g>
    );
}

