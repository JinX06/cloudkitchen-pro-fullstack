function assert(condition, message) {
    if (!condition) {
        throw error(message);
    }
}

function error(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

// ---- type checking ----
function isString(value) {
    return typeof value === "string";
}

function isNumber(value) {
    // make sure NaN is not valid
    return typeof value === "number" && !isNaN(value);
}

function isArray(arr) {
    return Array.isArray(arr);
}

function isObject(obj) {
    // make sure obj isn't an array or null (both treated as objects)
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

// ---- field assertions (return the value to assert and assign) ----
function assertString(str, field) {
    assert(isString(str), `${field} must be a string`);

    const trimmed = str.trim();
    assert(trimmed.length > 0, `${field} cannot be empty`);

    return trimmed;
}

function assertNumber(num, field) {
    assert(isNumber(num), `${field} must be a number`);
    return num;
}
function assertInteger(num, field) {
    assertNumber(num, field);
    assert(Number.isInteger(num), `${field} must be an integer`);
    return num;
}

function assertPositiveInt(num, field) {
    assertInteger(num, field);
    assert(num >= 1, `${field} must be an integer >= 1`);
    return num;
}

function assertNonNegativeNumber(num, field) {
    assertNumber(num, field);
    assert(num >= 0, `${field} must be >= 0`);
    return num;
}

function assertArray(arr, field) {
    assert(isArray(arr), `${field} must be an array`);
    return arr;
}
