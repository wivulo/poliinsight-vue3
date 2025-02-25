// src/composables/useRequest.js
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

interface iUseRequest {
    immediate: boolean;
    requestFn: any;
    successMessage?: string;
    errorMessage: string
}

export function useRequest(params?: iUseRequest) {
    const $toast = useToast();
    const data = ref(null);
    const busy = ref(false);
    const error = ref(null);

    const handlerError = (error: any) => {
        $toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    };

    async function request (requestFn: any, successMessage: string | null, errorMessage: string) {
        busy.value = true;
        error.value = null;
    
        try {
            const response = await requestFn();
    
            if (response && [200, 201, 202, 204].includes(response.status) && (response?.data && !response.data.error)) {
                if (successMessage)
                    $toast.add({ severity: 'success', summary: 'Success', detail: successMessage, life: 3000 });
                
                data.value = response?.data ? response.data : response;
                return data.value;
            } else {
                console.log(response);
                handlerError(errorMessage);
                throw new Error(errorMessage || 'Erro na requisição');
            }
        } catch (err) {
            console.log(err);
            error.value = err.message || 'Erro desconhecido';
            handlerError(error.value);
        } finally {
            busy.value = false;
        }
    };


    if (params?.immediate) {
        request(params.requestFn, params.successMessage, params.errorMessage);

        return {
            data,
            busy,
            error,
        };
    }

    return {
        data,
        busy,
        error,
        executeRequest: request
    };
}