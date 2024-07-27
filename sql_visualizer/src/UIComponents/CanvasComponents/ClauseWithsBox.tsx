import { ClauseWiths } from "@/QueryComponents/ClauseWiths";
import { ClauseWithBox } from "./ClauseWithBox";

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
    function handleOnSetWidth(w: number, i: number) {
        
    }
    function handleOnSetHeight(h: number, i: number) {

    }

    return (
        <>
            {withs.withs.map((w, i) =>
                <g
                    key={`G_WithBox_${i}`}
                    transform={`translate(${0}, ${0})`}
                >
                    <ClauseWithBox
                        _with={w}
                        width={100}
                        height={50}
                        setWidth={(w) => handleOnSetWidth(w, i)}
                        setHeight={(h) => handleOnSetHeight(h, i)}
                    />
                </g>
            )}
        </>
    );
}
