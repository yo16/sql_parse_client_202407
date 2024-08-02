import { useState, useEffect } from "react";

import { ClauseFrom } from "@/QueryComponents/ClauseFroms";
import { TableStructQuery } from "@/QueryComponents/TableStructQuery";
import { TableStructQueryBox } from "./TableStructQueryBox";

import { FROM_WIDTH, FORM_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";

interface ClauseFromBoxProps {
    clauseFrom: ClauseFrom;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseFromBox({
    clauseFrom,
    width,
    height,
    onSetSize,
}: ClauseFromBoxProps) {
    // TableStructQueryのサイズ
    const [curWidth, setCurWidth] = useState<number>(0);
    const [curHeight, setCurHeight] = useState<number>(0);

    useEffect(()=>{
        onSetSize(
            Math.max(width, curWidth),
            FORM_HEIGHT + curHeight
        );
    }, [clauseFrom, curWidth, curHeight]);

    function handleOnSetTableStructQuerySize(w: number, h: number) {
        setCurWidth(w);
        setCurHeight(h);
    }

    return (
        <>
            {/* table name */}
            <rect
                x={0}
                y={0}
                width={width}
                height={FORM_HEIGHT}
                fill={"#333"}
            />
            <text
                {...(getTextPosByHeight(FORM_HEIGHT))}
                fill={"#f00"}
            >
                {(clauseFrom.db)?`${clauseFrom.db}.`:''}{clauseFrom.tableName}
            </text>

            {(clauseFrom.tableStruct instanceof TableStructQuery)&&
                <g
                    transform={`translate(${0}, ${FORM_HEIGHT})`}
                    name={`FromBox-Query`}
                >
                    <TableStructQueryBox
                        tsq={clauseFrom.tableStruct}
                        width={width}
                        height={height}
                        onSetSize={handleOnSetTableStructQuerySize}
                    />
                </g>
            }
        </>
    );
}
