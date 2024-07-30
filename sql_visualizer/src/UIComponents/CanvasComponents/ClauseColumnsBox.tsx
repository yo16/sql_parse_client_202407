import { ClauseColumns } from "@/QueryComponents/ClauseColumns";

interface ClauseColumnsBoxProps {
    columns: ClauseColumns;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseColumnsBox({
    columns,
    width,
    height,
    onSetSize,
}: ClauseColumnsBoxProps) {
    return (
        <>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={"#00f"}
            />
        </>
    );
}
