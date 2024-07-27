import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { QueryEnterButton } from './QueryEnterButton';

import "./QuerySelector.css";

interface QuerySelectorProps {
    onChangedQuery: (query: string) => void;
}

function QuerySelector({
    onChangedQuery
}: QuerySelectorProps) {
    const [currentQuery, setCurrentQuery] = useState<string>("");

    // onDrop
    const onDrop = useCallback((acceptedFiles: File[]) => {
      // open if type is text/plain
      acceptedFiles.forEach((f) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string" ) {
                //console.log(`DROPPED! ${reader.result}`);
                setCurrentQuery(reader.result)
                onChangedQuery(reader.result);
            }
        });
        reader.readAsText(f, "utf-8");
      })
    }, [onChangedQuery]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    function handleOnEnterQuery(query: string) {
        //console.log(`ENTERED! ${query}`);
        setCurrentQuery(query);
        onChangedQuery(query);
    }

    return (
        <div
            className="query-selector-container"
        >
            {/* SQLファイルドロップゾーン */}
            <div
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <div
                    className={ "div-drop-zone " + (isDragActive?"div-drag-active":"") }
                >
                    Drop SQL-File
                </div>
            </div>

            <div>
                or
            </div>

            {/* 手入力ボタンゾーン */}
            <QueryEnterButton
                onEnterQuery={handleOnEnterQuery}
                defaultQuery={currentQuery}
            />

            <div>
                and Enter SQL Query!
            </div>
        </div>
    );
}

export { QuerySelector };
