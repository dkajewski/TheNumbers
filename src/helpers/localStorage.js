export default class LocalStorage
{
    static push(key, value) {
        let data = JSON.parse(localStorage.getItem(key)) || [];
        data.push(value);
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get(key) {


        return JSON.parse(localStorage.getItem(key)) || null;
    }

    static set(key, value) {
        console.log(value);
        localStorage.setItem(key, JSON.stringify(value));
    }
}
