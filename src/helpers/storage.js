export default class Storage
{
    static push(key, value) {
        let data = JSON.parse(localStorage.getItem(key)) || [];
        data.push(value);
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}
