import { ClauseFroms } from "@/QueryComponents/ClauseFroms";

interface ClauseFromsBoxProps {
    froms: ClauseFroms;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseFromsBox({
    froms,
    width,
    height,
    onSetSize,
}: ClauseFromsBoxProps) {
    return (
        <>
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={"#0f0"}
            />
        </>
    );
}
