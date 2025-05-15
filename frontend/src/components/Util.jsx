export function Format(str) {
    let formattedStr = str.replace(/([A-Z])/g, ' $1');
    formattedStr = formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
    return formattedStr;
}