// TableStructQueryに対応するcanvas要素
import { TableStructQuery } from "@QueryComponents/TableStructQuery";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";
import { QuerySelect } from "@/QueryComponents/QuerySelect";


interface TableStructQueryBoxProps {
    tsq: TableStructQuery;
    width: number;
    height: number;
    onSetSize: (w: number, h: number) => void;
}
function TableStructQueryBox({
    tsq,
    width,
    height,
    onSetSize,
}: TableStructQueryBoxProps) {
    function handleOnSetSize(w: number, h: number) {
        onSetSize(w, h);
    }

    return (
        <>
            {/* インスタンスごとにBoxを選択 */}
            {(tsq instanceof QuerySelect) &&
                <TableStructQuerySelectBox
                    select={tsq as QuerySelect}
                    width={width}
                    height={height}
                    onSetSize={handleOnSetSize}
                />
            }
        </>
    );
}

export {
    TableStructQueryBox
}
