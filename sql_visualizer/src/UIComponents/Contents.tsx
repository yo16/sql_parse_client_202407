
import { useState } from "react";
import { AST } from "node-sql-parser";

import { QuerySelector } from "./QuerySelector";
import { LineageCanvas } from "./LineageCanvas";
import { DisplayCtrlPanel } from "./DisplayCtrlPanel";


import "./Contents.css";

// パースサーバー
const SERVER_URL = (process.env.NODE_ENV==="development") ?
    "http://localhost:3001/sql"
    : "https://express-sql-parser-202403.onrender.com/sql"
;

// サーバーへのリクエスト形式
type RequestOption = {
    method: "POST";
    headers: {
        "Content-Type": "application/json";
    };
    body: string;   /* json形式 */
};

function Contents() {
    // サーバーでパースした結果
    const [astList, setAstList] = useState<AST[]>([]);

    // クエリ変更時
    function handleOnChangeQuery(query: string) {
        //console.log(query);

        // 空の場合は何もしない
        if (query.length===0) {
            return;
        }

        // パースサーバーへ投げる
        const reqOpt: RequestOption = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({query,}),
        };
        fetch(SERVER_URL, reqOpt)
            .then((res) => res.json())
            .then((json) => {
                if (Object.keys(json).length===0) {
                    return;
                }
                setAstList(json.ast);
            })
            .catch((e) => {
                console.error("Fetch Error", e);
            })
        ;

    }

    return (
        <div
            className="contents-container"
        >
            <QuerySelector
                onChangedQuery={ handleOnChangeQuery }
            />
            <LineageCanvas
                astList={ astList }
            />
            <DisplayCtrlPanel />
        </div>
    );
}

export { Contents };
