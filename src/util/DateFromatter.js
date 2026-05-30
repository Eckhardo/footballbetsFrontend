const formatDateTime = (date) => {

    const formattedDate = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Ensures 24-hour format (HH)
    }).format(date);

return  formattedDate.replaceAll('.', '-').replace(', ', ' ');

}
const validateDateTime = (dateString) => {

        const regex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
        const match = dateString.match(regex);

        if (!match) {
            return false; // Format is incorrect
        }

        // Extracting parts from the regex match
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Month is 0-indexed in JavaScript Date object (0-11)
        const year = parseInt(match[3], 10);
        const hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);

        // Create a Date object using extracted components
        const dateObject = new Date(year, month, day, hour, minute);

        // Check if the created date object's components match the original input components.
        // This verifies that the Date object didn't "roll over" to an invalid date (e.g., Feb 31 becomes Mar 3).
        const isValid = dateObject.getFullYear() === year &&
            dateObject.getMonth() === month &&
            dateObject.getDate() === day &&
            dateObject.getHours() === hour &&
            dateObject.getMinutes() === minute;

        // Check for "Invalid Date" case
        if (isNaN(dateObject.getTime())) {
            return false;
        }

        return isValid;
    }


export  {formatDateTime,validateDateTime} ;