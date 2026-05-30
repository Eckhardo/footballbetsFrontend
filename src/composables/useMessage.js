// composables/useMessage.js
import { ref, readonly } from 'vue'

const message = ref('');
const isVisible = ref(false);
let timeoutId = null;

export function useMessage() {

    const setMessage = (myMessage, duration = 5000) => {
        console.log("useMessage: ",myMessage, duration);
        // Vorherige Timeouts löschen
        if (timeoutId) clearTimeout(timeoutId);
        console.log("useMessage1: ");
        message.value = myMessage;
        isVisible.value = true;
        console.log("useMessage2: ");
        // Fehler nach Ablauf der Zeit automatisch ausblenden
        if (duration > 0) {
            timeoutId = setTimeout(() => {
                clearMessage();
            }, duration)
        }
        console.log("useMessage3: ");
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
