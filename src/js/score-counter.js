const scoreCounter = JSON.parse(localStorage.getItem('score')) || { score: 0 };

export default new Proxy(scoreCounter, {
    set(obj, key, val) {
        Reflect.set(obj, key, val);
        localStorage.setItem('score', JSON.stringify(obj));
        return true;
    },
});