import { ClauseWith } from "@/QueryComponents/ClauseWiths";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";

interface ClauseWithBoxProps {
    clauseWith: ClauseWith;      // withは予約語
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseWithBox({
    clauseWith,
    width,
    height,
    onSetSize,
}: ClauseWithBoxProps) {
    function handleOnSetSize(w: number, h: number) {
        console.log("widthが変わったよ withBox", w);
        onSetSize(w, h);
    }

    return (
        <>
            <TableStructQuerySelectBox
                select={clauseWith.select}
                width={width}
                height={height}
                onSetSize={handleOnSetSize}
            />
        </>
    );
}
/*
<rect
x={0}
y={0}
width={width}
height={height}
fill={"#f00"}
/>
*/