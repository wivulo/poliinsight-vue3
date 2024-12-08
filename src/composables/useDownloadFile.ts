import { ref } from "vue";

export function useDownloadFile(data: string, fileName: string) {
    const error = ref(null);

    function execute() {
        try {
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            error.value = err;
            console.error(err);
        }
    }

    return { error, execute };
}