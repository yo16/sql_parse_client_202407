import { ClauseWiths } from "@/QueryComponents/ClauseWiths";

interface ClauseWithsBoxProps {
    withs: ClauseWiths;
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
export function ClauseWithsBox({
    withs,
    width,
    height,
    setWidth,
    setHeight,
}: ClauseWithsBoxProps) {
    return (
        <>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={"#f00"}
            />
        </>
    );
}
