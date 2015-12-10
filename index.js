/**
 * Created by alykoshin on 10.12.15.
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  * Prevents errors on console methods when no console present.
//  * Exposes a global 'debug' function that preserves line numbering and formatting.
var _debug = function (obj) {
  var that = {};

  that.obj = obj;

  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];

  if ( typeof window !== 'undefined') {
    window.console = window.console || {};
    var console    = window.console;
  }

  if (!console['debug']) { console.debug = console.log; } // IE does not support debug.

  var length = methods.length;
  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if ( ! console[method] ) { // .hasOwnProperty(method) ) { // !console[method] ) {
      console[method] = noop; // Disable for console
      that[method]    = noop; // and for this object too
    } else {
      if (Function.prototype.bind) {
        that[method] = Function.prototype.bind.call(console[method], console, '%s'); // '%s' does not works for group
      } else {
        that[method] = Function.prototype.apply.call(console[method], console, 'xyz',arguments);
      }
    }
  }
  //if(that.obj) {
  //  console.log('>>>>>>>>>>>>', that.obj.debugId, that.obj);
  // }
  //  if (!console.debug) { // IE does not support console.debug
  //    that.debug = Function.prototype.bind.call(console.log,   console, pref + ' **** debug:   %s');;
  //  } else {
  //    that.debug = Function.prototype.bind.call(console.debug, console, pref + ' **** debug: %s');
  //  }

  /** Rewrite specific methods **/
  if (Function.prototype.bind) {
    // console.log('_debug(): if (Function.prototype.bind) ');
    var pref = '[' + ( (that.obj && that.obj.debugId) ? that.obj.debugId : 'null') +']';


    that.error = Function.prototype.bind.call(console.error, console, pref + ' * error: %s');
    that.warn  = Function.prototype.bind.call(console.warn , console, pref + ' ** warn:  %s');
    that.info  = Function.prototype.bind.call(console.info,  console, pref + ' *** info:  %s');
    if (!console.debug) { // IE does not support console.debug
      that.debug = Function.prototype.bind.call(console.log,   console);//pref + ' **** debug:   %s');;
    } else {
      that.debug = Function.prototype.bind.call(console.debug, console);//pref + ' **** debug: %s');
    }
    that.log   = Function.prototype.bind.call(console.log,   console, pref + ' ***** log:   %s');
    //    that.group = Function.prototype.bind.call(console.group, console, '%s');
    that.group = Function.prototype.bind.call(console.log, console, pref + ' GROUP:   %s');
    //    that.groupCollapsed = Function.prototype.bind.call(console.groupCollapsed, console, '%s');
    that.groupCollapsed = Function.prototype.bind.call(console.log, console, pref + ' GROUP: %s');
    //    if (!that.assert) { that.assert = Function.prototype.bind.call(console.error, console, '* assert: %s'); }
    //  } else {
    //    that.error = function() { Function.prototype.apply.call(console.error, console, arguments); };
    //    that.warn  = function() { Function.prototype.apply.call(console.warn , console, arguments); };
    //    that.info  = function() { Function.prototype.apply.call(console.info,  console, arguments); };
    //    that.debug = function() { Function.prototype.apply.call(console.debug, console, arguments); };
    //    that.log   = function() { Function.prototype.apply.call(console.log,   console, arguments); };
  }

  return that;
};
function _no_debug() {
  var that = {};
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  while (length--) {
    var method = methods[length];
    that[method] = noop;
  }
  return that;
}
//var debug = _no_debug();
var debug = _debug();
//var debug = console;

var assert     = function(condition, message) {
  if (!condition) {
    throw message ? 'Assertion failed: \'' + message +'\'': 'Assertion failed.';
  }
};
//var assert = debug.assert;

//assert(false, 'test-message');

//window.console = null;


////////////////////////////////////////////////////////////////////////////////

if (typeof module !== 'undefined') {
  var exports = debug;
  exports.debug = debug;
  exports.assert = assert;

  module.exports = exports;
}

if (typeof window !== 'undefined') {
  window.debug = debug;
  window.assert  = assert;
}
