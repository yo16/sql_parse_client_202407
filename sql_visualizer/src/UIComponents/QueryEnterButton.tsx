import { ReactNode, useState, useRef } from "react";

import "./QueryEnterButton.css";

const BUTTON_TEXT = "CLICK HERE";

interface QueryEnterButtonProps {
    onEnterQuery: (query:string) => void;   // 確定時に呼び出す
    defaultQuery?: string;
}

function QueryEnterButton({onEnterQuery, defaultQuery=""}: QueryEnterButtonProps){
    const [showEntryDialog, setShowEntryDialog] = useState<boolean>(false);
    // クエリのテキストエリアの値
    const inputQueryRef = useRef<HTMLTextAreaElement>(null);

    // ダイアログの表示/非表示ハンドル
    function handleShowEntryDialog(show: boolean) {
        setShowEntryDialog(show);

        // 表示時はフォーカスをあてる
        if (show) {
            setTimeout(() => document.getElementById("areaQueryEntry")?.focus());
        }
    }

    // 確定
    function handleOnQuerySubmit() {
        if (inputQueryRef && inputQueryRef.current){
            // 入力値を設定して返す
            onEnterQuery(inputQueryRef.current.value);
        } else {
            // 万が一初期値のままの場合は""とする
            onEnterQuery("");
        }
        
        // ダイアログをクローズ
        handleShowEntryDialog(false);
    }

    const entryArea: ReactNode = (
        <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center dark-overlay"
            onClick={()=>handleShowEntryDialog(false)}
        >
            <div
                className="query-input-area"
                onClick={(e)=>e.stopPropagation()}
            >
                <span>
                    Enter Query
                </span>
                <textarea
                    className="query-input-textarea"
                    ref={inputQueryRef}
                    defaultValue={defaultQuery}
                    id="areaQueryEntry"
                >
                </textarea>
                <div>
                    <button
                        onClick={() => handleShowEntryDialog(false)}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleOnQuerySubmit}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => handleShowEntryDialog(true)}
            >{BUTTON_TEXT}</button>
            {showEntryDialog && entryArea}
        </>
    );
}

export { QueryEnterButton };
