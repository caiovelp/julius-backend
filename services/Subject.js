class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(carteiraId, valor, addAmount) {
        for (let observer of this.observers) {
            observer.update(carteiraId, valor, addAmount);
        }
    }
}

module.exports = Subject;