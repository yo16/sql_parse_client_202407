// 共通関数

// number配列の比較
export function arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 文字を入力する高さに応じた、textのx位置、y位置
export function getTextPosByHeight(fontSize: number) {
    return {
        x: fontSize/4,
        y: fontSize*0.75,
        fontSize: fontSize/1.5,
    }
}
