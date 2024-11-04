// Decomposes the current date object
export const parseDate = () => {
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const currDate = new Date();
    const hours = currDate.getHours();
    const minutes = currDate.getMinutes();
    return {
        day: DAYS[currDate.getDay()],
        date: currDate.getDate(),
        month: MONTHS[currDate.getMonth()],
        year: currDate.getFullYear(),
        hours: hours <= 12 ? hours : hours - 12,
        minutes: (minutes < 10 ? '0' : '') + minutes,
        tag: (hours >= 12 && hours <= 23) ? "PM" : "AM"
    };
}