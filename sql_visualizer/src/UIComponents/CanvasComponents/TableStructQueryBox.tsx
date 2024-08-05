// TableStructQueryに対応するcanvas要素
import { TableStructQuery } from "@QueryComponents/TableStructQuery";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";
import { QuerySelect } from "@/QueryComponents/QuerySelect";


interface TableStructQueryBoxProps {
    tsq: TableStructQuery;
    onSetSize: (w: number, h: number) => void;
}
function TableStructQueryBox({
    tsq,
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
                    onSetSize={handleOnSetSize}
                />
            }
        </>
    );
}

export {
    TableStructQueryBox
}
