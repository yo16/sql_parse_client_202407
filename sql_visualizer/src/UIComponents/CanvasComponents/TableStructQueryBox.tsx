// TableStructQueryに対応するcanvas要素
import { TableStructQuery } from "@QueryComponents/TableStructQuery";
import { TableStructQuerySelectBox } from "./TableStructQuerySelectBox";
import { QuerySelect } from "@/QueryComponents/QuerySelect";


interface TableStructQueryBoxProps {
    tsq: TableStructQuery;
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
function TableStructQueryBox({
    tsq,
    width,
    height,
    setWidth,
    setHeight
}: TableStructQueryBoxProps) {
    return (
        <>
            {/* インスタンスごとにBoxを選択 */}
            {(tsq instanceof QuerySelect) &&
                <TableStructQuerySelectBox
                    select={tsq as QuerySelect}
                    width={width}
                    height={height}
                    setWidth={(w) => setWidth(w)}
                    setHeight={(h) => setHeight(h)}
                />
            }
        </>
    );
}

export {
    TableStructQueryBox
}
