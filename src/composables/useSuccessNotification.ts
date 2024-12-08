import { useNotification } from "./useNotification";

export function useSuccessNotification() {
    const { notify } = useNotification();
    
    const notifySuccess = (summary: string, detail: string) => {
        notify("success", summary, detail);
    };
    
    return { notifySuccess };
}