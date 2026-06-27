// composables/useMessage.js
import {readonly, ref} from 'vue'

const message = ref('');
const isVisible = ref(false);
let timeoutId = null;

export function useMessage() {

    const setMessage = (myMessage, duration = 3000) => {
        // Vorherige Timeouts löschen
        if (timeoutId) clearTimeout(timeoutId);
        message.value = myMessage;
        isVisible.value = true;
        // Fehler nach Ablauf der Zeit automatisch ausblenden
        if (duration > 0) {
            timeoutId = setTimeout(() => {
                clearMessage();
            }, duration)
        }
     }

    const clearMessage = () => {
        isVisible.value = false;
        message.value = '';
        if (timeoutId) clearTimeout(timeoutId);
    }

    return {
        message: readonly(message),
        isVisible: readonly(isVisible),
        setMessage,
        clearMessage
    }
}
