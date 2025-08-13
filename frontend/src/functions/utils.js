function sparseTimeStr(timeStr) {
    const dayMatch = timeStr.match(/(\d+)\s*days?/);
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);

    const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
    const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
    const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
    const seconds = timeMatch ? parseInt(timeMatch[3], 10) : 0;

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
};


function formatTimeStr(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const padded = (num) => num.toString().padStart(2, '0');
    const timePart = `${padded(hours)}:${padded(minutes)}`;

    return `${days}days ${timePart}`;
};


export { sparseTimeStr, formatTimeStr };