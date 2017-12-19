'use strict';

exports.__esModule = true;
exports.reducer = exports.actions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.signout = signout;
exports.signin = signin;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _reactRedux = require('react-redux');

var _reduxActions = require('redux-actions');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var actions = exports.actions = {
  config: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/CONFIG'),
  error: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/ERROR'),
  start: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/START'),
  reset: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/RESET'),
  cancel: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/CANCEL'),
  save: (0, _reduxActions.createAction)('REACT_REDUX_OAUTH2/SAVE'),
  signin: function signin(creds) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (f) {
      return f;
    };

    return function (dispatch, getState) {
      var config = getState().oauth.config;

      dispatch(actions.start());
      _axios2.default.post('' + config.url + config.token, Object.assign({
        client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: 'password',
        scope: 'all'
      }, creds)).then(function (res) {
        return dispatch(actions.sync(res.data, cb));
      }).catch(function (e) {
        dispatch(actions.error(e));
      });
    };
  },
  signout: function signout() {
    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (f) {
      return f;
    };

    return function (dispatch, getState) {
      var _getState$oauth = getState().oauth,
          user = _getState$oauth.user,
          config = _getState$oauth.config;

      _axios2.default.delete('' + config.url + config.token, {
        headers: { 'Authorization': 'Bearer ' + user.token.access_token }
      }).then(function (res) {
        dispatch(actions.reset());
        window.sessionStorage.clear();
        cb(null, res);
      }).catch(function (e) {
        dispatch(actions.error(e));
        cb(e);
      });
    };
  },
  auth: function auth(token) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (f) {
      return f;
    };

    return function (dispatch, getState) {
      var config = getState().oauth.config;

      return _axios2.default.get(config.url + '/user', {
        headers: { 'Authorization': '' + token.access_token }
      }).then(function (res) {
        var user = { token: res.token, profile: res.data };
        dispatch(actions.save(user));
        cb(null, user);
      }).catch(cb);
    };
  },
  sync: function sync(token) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (f) {
      return f;
    };

    return function (dispatch, getState) {
      var config = getState().oauth.config;

      return _axios2.default.get('https://api.github.com/user', {
        headers: { 'Authorization': 'Bearer ' + token.access_token }
      }).then(function (res) {
        var user = { token: token, profile: res.data };
        dispatch(actions.save(user));
        window.sessionStorage.setItem('key', token.access_token);
        cb(null, user);
      }).catch(cb);
    };
  }
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)({
  'REACT_REDUX_OAUTH2/CONFIG': function REACT_REDUX_OAUTH2CONFIG(state, action) {
    return _extends({}, state, { config: action.payload });
  },
  'REACT_REDUX_OAUTH2/START': function REACT_REDUX_OAUTH2START(state, action) {
    return _extends({}, state, { authenticating: true });
  },
  'REACT_REDUX_OAUTH2/CANCEL': function REACT_REDUX_OAUTH2CANCEL(state, action) {
    return _extends({}, state, { authenticating: false });
  },
  'REACT_REDUX_OAUTH2/ERROR': function REACT_REDUX_OAUTH2ERROR(state, action) {
    return _extends({}, state, { authenticating: false, error: action.payload });
  },
  'REACT_REDUX_OAUTH2/RESET': function REACT_REDUX_OAUTH2RESET(state, action) {
    return _extends({}, state, { authenticating: false, error: null, user: { token: null, profile: null } });
  },
  'REACT_REDUX_OAUTH2/SAVE': function REACT_REDUX_OAUTH2SAVE(state, action) {
    return _extends({}, state, {
      authenticating: false,
      user: action.payload
    });
  }
}, {
  authenticating: false,
  user: {
    token: null,
    profile: null
  },
  config: {
    url: 'http://localhost',
    token: '/oauth/token',
    client_id: null,
    client_secret: null,
    providers: {
      github: '/auth/github'
    }
  },
  error: null
});

function signout(settings) {
  settings = Object.assign({
    success: function success() {},
    failed: function failed() {}
  }, settings);
  return function (Component) {
    return (0, _reactRedux.connect)(function (state) {
      return { oauth: state.oauth };
    })(function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      _class.prototype.handleClick = function handleClick() {
        this.props.dispatch(actions.signout(function (e, res) {
          return e ? settings.failed(e) : settings.success(res);
        }));
      };

      _class.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            oauth = _props.oauth,
            rest = _objectWithoutProperties(_props, ['oauth']);

        var props = Object.assign({}, (0, _lodash.omit)(rest, ['dispatch']));
        props.disabled = false;
        props.disabled = oauth.authenticating || (0, _lodash.get)(oauth, 'user.profile') === null;
        props.onClick = (0, _lodash.wrap)(props.onClick, function (func, e) {
          _this2.handleClick(e);
          return func(e);
        });
        return _react2.default.createElement(Component, props);
      };

      _createClass(_class, null, [{
        key: 'defaultProps',
        get: function get() {
          return {
            onClick: function onClick() {}
          };
        }
      }]);

      return _class;
    }(_react2.default.Component));
  };
}
function signin(settings) {
  settings = Object.assign({
    popup: {
      scrollbars: 'no',
      toolbar: 'no',
      location: 'no',
      titlebar: 'no',
      directories: 'no',
      status: 'no',
      menubar: 'no',
      top: '100',
      left: '100',
      width: '600',
      height: '500'
    },
    success: function success() {},
    cancel: function cancel() {},
    failed: function failed() {}
  }, settings);
  return function (Component) {
    return (0, _reactRedux.connect)(function (state) {
      return { oauth: state.oauth };
    })(function (_React$Component2) {
      _inherits(_class2, _React$Component2);

      function _class2() {
        _classCallCheck(this, _class2);

        return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
      }

      _class2.prototype.handleClick = function handleClick(e, provider) {
        var _props2 = this.props,
            dispatch = _props2.dispatch,
            config = _props2.oauth.config;

        var url = '' + config.url + config.providers[provider];
        var name = 'connecting to ' + provider;
        dispatch(actions.start());
        this.listenPopup(window.open(url, name, _queryString2.default.stringify(settings.popup).replace(/&/g, ',')));
      };

      _class2.prototype.listenPopup = function listenPopup(popup) {
        var dispatch = this.props.dispatch;

        if (popup.closed) {
          dispatch(actions.cancel());
          settings.cancel();
        } else {
          var token = void 0;
          try {
            token = _queryString2.default.parse(popup.location.search.substr(1));
          } catch (e) {}
          if (token && token.access_token) {
            dispatch(actions.sync(token, function (err, user) {
              if (err) {
                dispatch(actions.error(err));
                settings.failed(err);
                popup.close();
              } else {
                settings.success(user);
              }
            }));
            popup.close();
          } else {
            setTimeout(this.listenPopup.bind(this, popup), 0);
          }
        }
      };

      _class2.prototype.render = function render() {
        var _this4 = this;

        var _props3 = this.props,
            oauth = _props3.oauth,
            provider = _props3.provider,
            rest = _objectWithoutProperties(_props3, ['oauth', 'provider']);

        var props = Object.assign({}, (0, _lodash.omit)(rest, ['dispatch', 'onCancel', 'onSuccess', 'onFailed']));
        props.disabled = oauth.authenticating || (0, _lodash.get)(oauth, 'user.profile') !== null;
        props.onClick = (0, _lodash.wrap)(props.onClick, function (func, e) {
          _this4.handleClick(e, provider);
          return func(e);
        });
        return _react2.default.createElement(Component, props);
      };

      _createClass(_class2, null, [{
        key: 'defaultProps',
        get: function get() {
          return {
            onClick: function onClick() {}
          };
        }
      }]);

      return _class2;
    }(_react2.default.Component));
  };
}