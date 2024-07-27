import { ClauseColumns } from "@/QueryComponents/ClauseColumns";

interface ClauseColumnsBoxProps {
    columns: ClauseColumns;
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
export function ClauseColumnsBox({
    columns,
    width,
    height,
    setWidth,
    setHeight,
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
