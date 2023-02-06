import { ref, onUnmounted } from 'vue'

export const useToast = () => {
    const showToast = ref(false);
    const toastMessage = ref('');
    const ToastType = ref('');
    const toastTimeout = ref('null');
    const triggerToast = (message, type) => {
        toastMessage.value = message
        ToastType.value = type
        showToast.value = true
        toastTimeout.value = setTimeout(() => {
            toastMessage.value = ''
            showToast.value = false
        }, 3000);
    }

    onUnmounted(() => {
        clearTimeout(toastTimeout.value)
    })

    return {
        showToast,
        toastMessage,
        ToastType,
        triggerToast
    }
}