// TableStructQueryに対応するcanvas要素
import { TableStructQuery } from "@QueryComponents/TableStructQuery";


interface TableStructQueryBoxProps {
    tsq: TableStructQuery;
    x: number;
    y: number;
    width: number;
    height: number;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
}
function TableStructQueryBox({
    tsq,
    x,
    y,
    width,
    height,
    setWidth,
    setHeight
}: TableStructQueryBoxProps) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect
                x={0}
                y={0}
                width={75}
                height={50}
                rx={5}
                ry={5}
                fill={"#ff0"}
            />
        </g>
    );
}

export {
    TableStructQueryBox
}
