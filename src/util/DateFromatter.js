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
/**
 * Validates a German date-time string ("DD.MM.YYYY, HH:mm" or "DD.MM.YYYY HH:mm")
 * @param {string} germanDateStr
 * @returns {boolean}
 */
 const isValidGermanDateTime= (germanDateStr) => {
    // Matches DD.MM.YYYY, HH:mm (comma is optional)
    console.log("check date::", germanDateStr);
    const regex = /^(\d{2})\.(\d{2})\.(\d{4}),?\s(\d{2}):(\d{2})$/;
    const match = germanDateStr.match(regex);
    console.log("is valid?");
    if (!match) return false;

    const [, day, month, year, hour, minute] = match.map(Number);

    // Check basic time bounds
    if (hour > 23 || minute > 59 || month < 1 || month > 12 || day < 1) {
        return false;
    }

    // Verify exact calendar date (e.g. rejects Feb 30)
    const date = new Date(year, month - 1, day, hour, minute);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
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
// Formatter function
const formatGermanDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);

    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};
const convertGermanDateToTimestamp=(germnaDate) => {
    const [datePart, timePart] = germnaDate.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoFormat = `${year}-${month}-${day}T${timePart}`;

// 2. Convert to millisecond timestamp (Local Time)
  return  new Date(isoFormat).getTime();

}
export  {formatDateTime,validateDateTime,formatGermanDate,isValidGermanDateTime, convertGermanDateToTimestamp} ;