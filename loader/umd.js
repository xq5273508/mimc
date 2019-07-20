module.exports = function (content, map, meta) {
  return `${content}
if (typeof define === "function" && define.amd) {
  define(factory());
}
else if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
 Object.assign(module.exports,factory());
}
else {
  const variable=factory();
  let key;
  for (key in variable) {
    window[key] = variable[key];
  }
}`;
};