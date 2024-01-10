class Observer {
    update() {
        throw new Error("Update method must be implemented.");
    }
}

module.exports = Observer;