import { ClauseWith } from "@/QueryComponents/ClauseWiths";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";

interface ClauseWithBoxProps {
    clauseWith: ClauseWith;      // withは予約語
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
export function ClauseWithBox({
    clauseWith,
    width,
    height,
    setWidth,
    setHeight,
}: ClauseWithBoxProps) {
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
