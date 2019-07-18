module.exports.CommandArgsError = class CommandArgsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CommandArgsError';
    }
};

module.exports.EntryAlreadyExistsError = class EntryAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EntryAlreadyExistsError';
    }
};

module.exports.EntryNotFoundError = class EntryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EntryNotFoundError';
    }
};

module.exports.ValueError = class ValueError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValueError';
    }
};
