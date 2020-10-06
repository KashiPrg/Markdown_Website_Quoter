// 拡張機能がインストールされたときに右クリックメニューを追加
chrome.runtime.onInstalled.addListener((): void => {
    chrome.contextMenus.create({
        id: "make_markdown_link_menu",
        title: chrome.i18n.getMessage("conMenuMakeMarkdownLink"),
        contexts: ["all"],
        type: "normal",
        onclick: makeMarkdownLink
    });
});

function makeMarkdownLink(): void {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if (tabs.length > 0) {
            // document.execCommand("copy")は何かしらの文面にフォーカスが当たっていないと使えないため、
        // フォーカス用のテキストエリアを用意する
        const textAreaForCopy = document.createElement("textarea");
        // テキストエリアにコピーしたいテキストをセットする
        textAreaForCopy.textContent = `[${tabs[0].title}](${tabs[0].url})`;

        // そのページのbodyタグの要素を取得し、用意したテキストエリアを追加
        document.querySelector("body")?.append(textAreaForCopy);
        // テキストエリアを選択(なお、この時すでに選択している箇所は選択解除されない)
        textAreaForCopy.select();
        // 選択された箇所をコピー
        document.execCommand("copy");
        // 追加されたテキストエリアは本来余分なものなので消しておく
        textAreaForCopy.remove();
        }
    });
}

chrome.commands.onCommand.addListener(function (command) {
    switch(command) {
        case "make_MarkdownLink":
            makeMarkdownLink();
            break;
        default:
            break;
    }
});