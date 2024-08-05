import { useState, useEffect } from "react";

import { ClauseFrom } from "@/QueryComponents/ClauseFroms";
import { TableStructQuery } from "@/QueryComponents/TableStructQuery";
import { TableStructQueryBox } from "./TableStructQueryBox";

import { FROM_WIDTH, FORM_NAME_HEIGHT } from "./constCanvasComponents";
import { getTextPosByHeight } from "./commonFunctions";

interface ClauseFromBoxProps {
    clauseFrom: ClauseFrom;
    onSetSize: (w: number, h: number) => void;
}
export function ClauseFromBox({
    clauseFrom,
    onSetSize,
}: ClauseFromBoxProps) {
    // TableStructQueryのサイズ
    const [tsqWidth, setTsqWidth] = useState<number>(FROM_WIDTH);
    const [tsqHeight, setTsqHeight] = useState<number>(0);

    useEffect(()=>{
        onSetSize(
            Math.max(tsqWidth, FROM_WIDTH),
            FORM_NAME_HEIGHT + tsqHeight
        );
    }, [clauseFrom, tsqWidth, tsqHeight]);

    function handleOnSetTableStructQuerySize(w: number, h: number) {
        setTsqWidth(w);
        setTsqHeight(h);
    }

    return (
        <>
            {/* table name */}
            <rect
                x={0}
                y={0}
                width={Math.max(tsqWidth, FROM_WIDTH)}
                height={FORM_NAME_HEIGHT}
                fill={"#333"}
            />
            <text
                {...(getTextPosByHeight(FORM_NAME_HEIGHT))}
                fill={"#f00"}
            >
                {(clauseFrom.db)?`${clauseFrom.db}.`:''}{clauseFrom.tableName}
            </text>

            {(clauseFrom.tableStruct instanceof TableStructQuery)&&
                <g
                    transform={`translate(${0}, ${FORM_NAME_HEIGHT})`}
                    name={`FromBox-Query`}
                >
                    <TableStructQueryBox
                        tsq={clauseFrom.tableStruct}
                        onSetSize={handleOnSetTableStructQuerySize}
                    />
                </g>
            }
        </>
    );
}
