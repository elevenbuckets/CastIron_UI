'use strict';

var myObj = {
  property: 1,
  sendTo: function sendTo(endpoint) {
    console.log('sending ' + this.property + ' to ' + endpoint);
  }
};

function format() {
  console.log('formatting ' + this.property);
}

function log() {
  console.log('logging ' + this.property);
}

before(myObj, 'sendTo', format);
after(myObj, 'sendTo', log);

myObj.sendTo('backend');

function before(object, method, fn) {
  var originalMethod = object[method];
  object[method] = function () {
    fn.apply(object);
    originalMethod.apply(object, arguments);
  };
}

function after(object, method, fn) {
  var originalMethod = object[method];
  object[method] = function () {
    originalMethod.apply(object, arguments);
    fn.call(object);
    console.log(arguments);
  };
}