export function useDocumentTitle() {
    function execute(title: string) {
        document.title = title;
    }

    return { execute };
}