// composables/useError.js
import { ref, readonly } from 'vue'

const message = ref('');
const isVisible = ref(false);
let timeoutId = null;

export function useError() {

    const setError = (error, duration = 5000) => {
        // Vorherige Timeouts löschen
        if (timeoutId) clearTimeout(timeoutId);

        message.value = error.errorDetails;
        isVisible.value = true;
        // Fehler nach Ablauf der Zeit automatisch ausblenden
        if (duration > 0) {
            timeoutId = setTimeout(() => {
                clearError();
            }, duration)
        }
    }

    const clearError = () => {
        isVisible.value = false;
        message.value = '';
        if (timeoutId) clearTimeout(timeoutId);
    }

    return {
        message: readonly(message),
        isVisible: readonly(isVisible),
        setError,
        clearError
    }
}
