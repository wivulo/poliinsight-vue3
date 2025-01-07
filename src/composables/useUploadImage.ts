import { ref } from 'vue';
import { useToast } from 'primevue/useToast';
import ImageService from '@/services/ImageService';

export const useUploadImage = () => {
    const $toast = useToast();
    const data = ref(null);
    const busy = ref(false);
    const error = ref(null);

    const handleMessage = (message: string = 'Operação concluida', type: 'success'|'error' = 'success') => {
        $toast.add({ severity: type, summary: type, detail: message, life: 3000 });
    };
    
    const handlerErrorMessage = (error: string) => {
        console.error(error);
        handleMessage('Operação não concluida', 'error');
    };

    const upload = async (file: File) => {
        try {
            busy.value = true;
            const response = await ImageService.store(file)
            
            if(response.status > 299 || response.status < 200 || response.data?.error) {
                throw new Error(response.data?.error || 'Erro ao fazer upload da imagem');
            }

            data.value = response.data.imageUrl;
            handleMessage('Imagem carregada com sucesso', 'success');
            return response.data.imageUrl;
        } catch (error) {
            console.error(error);
            error.value = error;
            handlerErrorMessage(error)
            return null
        } finally {
            busy.value = false;
        }
    }

    return {
        data,
        busy,
        error,
        upload
    }

}