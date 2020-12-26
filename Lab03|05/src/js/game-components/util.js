/**
 * Generate a random number within a closed range
 * @param  {Integer} min Minimum of range
 * @param  {Integer} max Maximum of range
 * @return {Integer}     random number generated
 */
const randomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculate distance between two points
 * @param  {Number} x1 first point
 * @param  {Number} y1 first point
 * @param  {Number} x2 second point
 * @param  {Number} y2 second point
 */
const distanceFormula = function(x1, y1, x2, y2) {
    var withinRoot = Math.pow(x1-x2,2) + Math.pow(y1-y2,2);
    var dist = Math.pow(withinRoot,0.5);
    return dist;
};

const rad = deg => deg * Math.PI / 180;
const deg = rad => rad * 180 / Math.PI;

const sin = deg => Math.sin(rad(deg));
const cos = deg => Math.cos(rad(deg));

const spawn = (x, y, w, h, ox, oy, sx, sy, nx, ny) => ({x: x + (nx + 0.5) * (w - 2 * ox) / sx, y: y + (ny + 0.5) * (h - 2 * oy) / sy});

const interpol = (x1, y1, x2, y2, d) => {
    const d1 = distanceFormula(x1, y1, x2, y2);
    return {x: x1 + (x2 - x1) * d / d1, y: y1 + (y2 - y1) * d / d1};
};

const Util = {
    randomInt,
    distanceFormula,
    rad,
    deg,
    sin,
    cos,
    spawn,
    interpol,
};

export default Util;
