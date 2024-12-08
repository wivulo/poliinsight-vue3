import { useNotification } from "./useNotification";

export function useErrorNotification() {
    const { notify } = useNotification();
    
    const notifyError = (detail: any) => {
        notify("error", 'Erro', detail);
    };
    
    return { notifyError };
}