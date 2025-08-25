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

// ---- enum/difficulty validator (Easy, Medium, Hard) ----
function assertEnum(value, allowed, field) {
    const cleanValue = assertString(value, field);

    const allowedClean = allowed.map(v => v.toUpperCase());
    assert(allowedClean.includes(cleanValue.toUpperCase()), `${field} must be one of: ${allowed.join(", ")}`);

    return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
}

// ---- date validator ----
function assertDate(date, field) {
    const retDate = assertString(date, field);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(retDate), `${field} must be in YYYY-MM-DD format`); // RegEx.test for format check of date

    // parse the date to a date object
    const parts = retDate.split("-"); // parts = [year, month, day]
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(retDate);

    // validate the parsed date
    assert(dateObj.getFullYear() === year, `${field} has an invalid year: ${year}`);
    assert(dateObj.getMonth() + 1 === month, `${field} has an invalid month: ${month}`);  //getMonth() start from 0
    assert(dateObj.getDate() === day, `${field} has an invalid day: ${day}`);


    return retDate;
}

// ---- array validator | validates: (instruction + ingredients) ----
function trimStringsInArray(arr, field) {

    assertArray(arr, field);
    const ret = [];

    // Check and trim each string in the array
    for (let i = 0; i < arr.length; i++) {
        const assertMessage = `${field}[${i}]`;

        const item = arr[i];
        assert(isString(item), `${assertMessage} must be a string`);
        const trimmed = assertString(item, assertMessage);

        ret.push(trimmed);
    }
    return ret;
}

// ---- ingredients validator (string or object) ----
// Accepts either "string" or { name, quantity } as per your data model table.
function validateIngredientEntry(entry, index, fieldName = "ingredients") {
    const assertMessage = `${fieldName}[${index}]`; // the current ingredient entry

    // Basic ingredient validation for strings
    if (isString(entry)) {
        return assertString(entry, assertMessage);
    }

    // Object ingredient validation with item and quantity
    assert(isObject(entry), `${assertMessage} must be a string or object`);

    const name = assertString(entry.name, `${assertMessage}.name`);

    let quantity = -1;
    if (isNumber(entry.quantity)) {
        const quantityRaw = assertNonNegativeNumber(entry.quantity);
        quantity = String(quantityRaw);
    } else {
        quantity = assertString(entry.quantity, `${assertMessage}.quantity`);
    }

    return { name, quantity }; // return object
}

module.exports = {
    // error + assert
    error, assert,
    // type guards
    isString, isNumber, isArray, isObject,
    // assertions
    assertString, assertNumber, assertInteger,
    assertPositiveInt, assertNonNegativeNumber, assertArray,
    assertEnum, assertDate,
    // helpers
    trimStringsInArray, validateIngredientEntry,
};