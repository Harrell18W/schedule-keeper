module.exports.EntryNotFoundError = class EntryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EntryNotFoundError';
    }
}