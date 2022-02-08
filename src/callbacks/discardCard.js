'use strict'

module.exports = function removeRandomItem (objects, startIndex, length) {

    if (objects == null) { // undefined or null
        return null;
    }

    if (startIndex === undefined) { startIndex = 0; }
    if (length === undefined) { length = objects.length; }

    let randomIndex = startIndex + Math.floor(Math.random() * length);
    if (randomIndex < objects.length)
    {
        var removed = objects.splice(randomIndex, 1);
        return removed[0] === undefined ? null : removed[0];
    }
    else
    {
        return null;
    }
};
