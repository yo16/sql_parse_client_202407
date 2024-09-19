// ClauseColumnBox
// 
// ElementsBoxのラッパー。
// サイズ等の描画に関わる処理は、ElementsBoxで行う。
// ここでは、Column特有の情報から、
// 汎用的なElementsBoxに渡す情報へ、変換する役割を担う。

import { useMemo } from "react";
import { ClauseColumn } from "@/QueryComponents/ClauseColumns";
import { TableColumns } from "@/QueryComponents/TableColumns";
import { ElementsBox } from "./ElementsBox";

import { BoxSize } from "./types";
import { joinTableAndColumnName } from "./commonFunctions";

interface ClauseColumnBoxProps {
    clauseColumn: ClauseColumn;
    onSetSize: (newSize: BoxSize) => void;
}
export function ClauseColumnBox({
    clauseColumn,
    onSetSize,
}: ClauseColumnBoxProps) {

    // 親の名前群と、子の名前
    const [parentNames, childName]: [string[], string]
        = useMemo(
            () => {
                const tc: TableColumns = clauseColumn.tableCols;
                const tableNames: string[] = tc.getTables();
                if (tc.columnCount > 1) {
                    // 参照している列が２つ以上の場合
                    // 親
                    const parentNames: string[] = tableNames.map((tableName: string) => {
                        const colNames = tc.getColumnsByTable(tableName);
                        return colNames.map(
                            (colName: string) => joinTableAndColumnName(tableName, colName)
                        );
                    }).flat();
                    // 子（たぶんasはあるはず・・・）
                    const childName: string
                        = clauseColumn.asColumnName? clauseColumn.asColumnName: "";
                    return [parentNames, childName];

                } else if (tc.columnCount == 0) {
                    // 参照している列がゼロの場合
                    // 親＝asの名前があるはず
                    // 子なし
                    const asName: string
                        = clauseColumn.asColumnName? clauseColumn.asColumnName: "";
                    return [[asName], ""];
                }
                // 以下は、参照している列が１つの場合
                
                const targetTable: string = tc.getTables()[0];
                const targetColumn: string = tc.getColumnsByTable(targetTable)[0];
                const parentName: string = joinTableAndColumnName(targetTable, targetColumn);
                
                // 列名が一致している場合は、親のみ
                if (targetColumn === clauseColumn.columnName) {
                    return [
                        [parentName],
                        ""
                    ];
                };
                // 以下は、参照している列が１つで、親子で列名が一致していない場合
                
                return [
                    [parentName],
                    clauseColumn.columnName
                ];
            },
            [clauseColumn]
        );

    function handleOnSetSize(newSize: BoxSize) {
        onSetSize(newSize);
    }

    return (
        <ElementsBox
            parentNames={parentNames}
            childName={childName}
            onSetSize={handleOnSetSize}
        />
    );
}
