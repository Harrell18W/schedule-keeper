function Employee(firstName, lastName, slackUserId, id,
                  email=null, phone=null) {
    if (typeof firstName !== 'string' || firstName.length < 1) {
        throw new Error('firstName of Employee must be a string with length > 1');
    }
    if (typeof lastName !== 'string' || lastName.length < 1) {
        throw new Error('lastName of Employee must be a string with length > 1');
    }
    if (typeof slackUserId !== 'string' || slackUserId.length !== 9) {
        throw new Error('slackUserId must be a string with length 9');
    }
    if (typeof id !== 'string' || id.length !== 32) {
        throw new Error('id must be a string with length 32');
    }
    if (email && typeof email !== 'string') {
        throw new Error('email must be null or string');
    }
    if (phone && typeof phone !== 'number') {
        throw new Error('phone must be null or number');
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.slackUserId = slackUserId;
    this.id = id;
}

Employee.prototype = {
    constructor: Employee,

    fullName: function() {
        return this.firstName + ' ' + this.lastName;
    },

    queryFormattedValues: function() {
        return `(${this.firstName}, ${this.lastName}, ${this.email}, ${this.phone}, \
${this.slackUserId}, ${this.id})`;
    }
}

module.exports = Employee;