// ClauseFromBox
// 
// ElementsBoxのラッパー。
// サイズ等の描画に関わる処理は、ElementsBoxで行う。
// ここでは、From特有の情報から、
// 汎用的なElementsBoxに渡す情報へ、変換する役割を担う。

import { useMemo } from "react";

import { TableStructQuery } from "@/QueryComponents/TableStructQuery";
import { ClauseFrom } from "@/QueryComponents/ClauseFroms";
import { TableStructQueryBox } from "./TableStructQueryBox";
import { ElementsBox } from "./ElementsBox";

import { BoxSize } from "./types";


interface ClauseFromBoxProps {
    clauseFrom: ClauseFrom;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseFromBox({
    clauseFrom,
    onSetSize,
}: ClauseFromBoxProps) {
    // 親の名前群と、子の名前
    const [parentNames, childName]: [string[], string]
        = useMemo(
            () => {
                // asがあったら子に設定
                let childName: string = "";
                if (clauseFrom.asTableName) {
                    // asがある
                    childName = clauseFrom.asTableName;
                }

                // fromの親は１個しかないけど
                // select文の場合はundefになっている
                const parentName: string
                    = clauseFrom.originTableName? clauseFrom.originTableName: "";

                return [
                    [parentName],
                    childName
                ];
            },
            [clauseFrom]
        );

    // ハンドラは上へそのまま伝えるだけ
    function handleOnSetSize(newSize: BoxSize) {
        onSetSize(newSize);
    }
    // TableStructQueryBoxのonSetSizeは
    // ElementsBoxの中で書き換えられるはずなので、
    // ここではダミーで受け取っておく
    function handleDummy(width: number, height: number) {}

    return (
        <ElementsBox
            parentNames={parentNames}
            childName={childName}
            onSetSize={handleOnSetSize}
        >
            {(clauseFrom.tableStruct instanceof TableStructQuery) && (
                <TableStructQueryBox
                    tsq={clauseFrom.tableStruct}
                    onSetSize={handleDummy}
                />
            )}
        </ElementsBox>
    );
}
