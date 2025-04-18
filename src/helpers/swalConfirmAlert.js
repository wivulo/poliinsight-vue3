import Swal from 'sweetalert2';

export const SwalConfirmAlert = async () => {
    const result = await Swal.fire({
        title: '',
        text: 'Tem a certeza?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, Tenho',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#CBD5E1',
        reverseButtons: true,
    })

    return result.isConfirmed;
}