module.exports.EntryNotFoundError = class EntryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EntryNotFoundError';
    }
}

module.exports.ValueError = class ValueError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValueError';
    }
}