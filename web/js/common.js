
polyfills();
serviceHost = "https://support.lsdsoftware.com";

function polyfills() {
  Array.prototype.groupBy = function(keySelector, valueSelector) {
    var result = {};
    for (var i=0; i<this.length; i++) result[keySelector(this[i])] = (valueSelector ? valueSelector(this[i]) : this[i]);
    return result;
  }
}
