import { TableColumns } from "@/QueryComponents/TableColumns";

// １つの列のために利用する列群
interface ColumnElementsBoxProps {
    tableColumns: TableColumns;
    onSetSize: (w: number, h: number) => void;
}
export function ColumnElementsBox({
    tableColumns,
    onSetSize,
}: ColumnElementsBoxProps) {


    return (
        <>
        </>
    );
}

// １つの列のために利用する列群のうちの１つ
function ColumnOneElementBox() {
    return (
        <></>
    )
}
