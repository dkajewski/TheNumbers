import LocalStorage from "./localStorage";

export default class Utility
{
    /**
     * Get a formatted timestamp. In the original Lost TV series, the timestamp has a different format, but this is a more readable version.
     * For more info go to: https://lostpedia.fandom.com/wiki/Log_printout
     * @param now
     * @returns {string}
     */
    static getFormattedTimestamp(now) {
        return ('0' + now.getFullYear()).slice(-2)
            + ('0' + (now.getMonth() + 1)).slice(-2)
            + ('0' + now.getDate()).slice(-2)
            + ('0' + now.getHours()).slice(-2) + ':'
            + ('0' + now.getMinutes()).slice(-2);
    }

    static pushLogEntry(message) {
        LocalStorage.push('eventLog', {
            timestamp: Utility.getFormattedTimestamp(new Date()),
            message: message
        });
    }

    static clearLog() {
        LocalStorage.set('eventLog', []);
    }
}
