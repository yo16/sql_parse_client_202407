// 共通関数

import { NULL_TABLE_NAME } from "@/QueryComponents/TableColumns";
import { BoxSize } from "./types";

// number配列の比較
export function arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 文字を入力する高さに応じた、textのx位置、y位置
export function getTextPosByHeight(rectHeight: number) {
    return {
        x: rectHeight/4,
        y: rectHeight*0.75,
        fontSize: rectHeight/1.5,
    };
}

// BoxSizeの配列の初期設定
export function initializeBoxSizes(fromCount: number): BoxSize[] {
    return new Array(fromCount).fill({width: 0, height: 0});
}

// DB名とテーブル名と列名をくっつける処理
// テーブル名が NULL_TABLE_NAME の場合は、テーブル名を書かない
export function joinTableAndColumnName(
    tableName: string,
    columnName: string,
    dbName?: string,
) {
    if (tableName === NULL_TABLE_NAME) {
        return columnName;
    }
    const localDbName: string = dbName? `${dbName}.`: "";
    const localTableName: string = (tableName.length > 0)? `${tableName}.`: "";

    return `${localDbName}${localTableName}${columnName}`;
}
