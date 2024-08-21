import {
    COLUMN_WIDTH, COLELM_HEIGHT, COLELM_INDENT_WIDTH
} from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";
import { BoxSize } from "./types.d";

// １つの列のために利用する列群のうちの１つ
interface ColumnElementBoxProps {
    tableName: string;
    columnName: string;
    onSetSize: (bs: BoxSize) => void;
}
export function ColumnElementBox({
    tableName,
    columnName,
    onSetSize,
}: ColumnElementBoxProps) {
    // 高さに合った位置を計算
    const textPosBase = getTextPosByHeight(COLELM_HEIGHT);
    // x位置をインデント分、ずらす
    const textPos = {...textPosBase, x: textPosBase.x + COLELM_INDENT_WIDTH};

    function createTableColumnName(tableName: string, columnName: string): string {
        return `${tableName}.${columnName}`;
    }
    
    onSetSize({width: COLUMN_WIDTH, height: COLELM_HEIGHT});
    console.log(tableName, columnName);

    return (
        <>
            <rect
                x={0}
                y={0}
                width={COLUMN_WIDTH}
                height={COLELM_HEIGHT}
                fill={"#ccc"}
            />
            <text
                {...textPos}
                fill={"#f60"}
            >
                {createTableColumnName(tableName, columnName)}
            </text>
        </>
    )
}
