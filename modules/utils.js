/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 2,
maxerr: 50, node: true */
/*jslint white: true */
/*global $ */

(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["node/node_modules/lodash/lodash"], factory);
	}
	else {
		// Global (browser)
		root.eqUtils = factory();
	}
}(this, function (_) {
  "use strict";
  if (!_) {
    _ = require("../node/node_modules/lodash/lodash");
  }

  var _uniq;
  var eqUtils = {
    parseQuery: function (str) {
      var query = {};
      var a = str.substr(1).split('&');
      var i = 0;
      for (i; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
      }
      return query;
    },
    chain: function () {
      var functions = Array.prototype.slice.call(arguments, 0);
      if (functions.length > 0) {
        var firstFunction = functions.shift(),
            firstPromise = firstFunction.call();
        firstPromise.done(function () {
          eqUtils.chain.apply(null, functions);
        });
      }
    },
    uniq: function () {
      var n = Date.now(),
          suf = '';
      if (!_uniq) {
        _uniq = {
          n: n,
          suffix: 0
        };
      } else {
        if (_uniq.n && _uniq.n === n) {
          _uniq.suffix++;
          suf = _uniq.suffix;
        } else {
          _uniq.suffix = 0;
        }
      }
      return n.toString(32) + suf;
    },
    escapeRegExp: function (str, exceptions) {
      var to_delete = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|', '!'];
      if (!exceptions) {
        exceptions = [];
      } else {
        if (!_.isArray(exceptions)) {
          if (_.isString(exceptions)) {
            exceptions = exceptions.split(',');
          } else {
            exceptions = [];
          }
        }
      }
      exceptions.forEach(function (v, i) {
        v = v.trim();
        var found = _.indexOf(to_delete, v);
        if (found > -1) {
          to_delete.splice(found, 1);
        }
      });
      to_delete.forEach(function (v, i) {
        to_delete[i] = '\\' + v;
      });
      to_delete = to_delete.join('');
      return str.replace(new RegExp('[' + to_delete + ']', 'g'), "\\$&");
    },
    normalize: function (path) {
      if (_.isString(path)) {
        return path.replace(/\\+/g, '/').replace(/\/\/+/g, '/');
      }
      return path;
    },
    parseConnectionString: function (str) {
      if (!str || !_.isString(str)) {
        return false;
      }
      //var m = str.match(/((ftp|sftp):\/\/)?((.*?)(:(.*?))?@)?([A-Z\.\-\_a-z0-9]+)(:(\d+))?/i);
      /*
      ** $2 - protocol
      ** $4 - login
      ** $6 - password
      ** $7 - domain
      ** $9 - port
      */
      var m = str.match(/((ftp|sftp):\/\/)?([^\s:]*)(:(.*))?@([^:\s]*)(:(.*))?/i);
      /*
      ** $2 - protocol
      ** $3 - login
      ** $5 - password
      ** $6 - domain
      ** $8 - port
      */
      if (!m) {
        return false;
      }
      if (!m[3] || !m[6]) {
        return false;
      }
      return {
        protocol: m[2],
        login: m[3],
        password: m[5],
        server: m[6],
        port: m[8]
      };
    }
  };
  return eqUtils;
}));