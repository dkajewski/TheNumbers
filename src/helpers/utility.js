export default class Utility
{
    static getFormattedTimestamp(now) {
        return ('0' + now.getFullYear()).slice(-2)
            + ('0' + (now.getMonth() + 1)).slice(-2)
            + ('0' + now.getDate()).slice(-2)
            + ('0' + now.getHours()).slice(-2) + ':'
            + ('0' + now.getMinutes()).slice(-2);
    }
}
