"use strict";

class Square {
    constructor (type, meta) {
        this.type = type;
        this.meta = meta || {};
    }

    is (type) {
        return this.type === type;
    }

    isnt (type) {
        return !this.is(type);
    }
}

module.exports = Square;
