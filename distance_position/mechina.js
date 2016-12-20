var path = require('path')
var part = 'core calc link page'.split(' ')
// prefix global for more understandable!

global.load = {}
for (var i = part.length; i--;) {
  global.load[part[i]] = (function (slef) {
    return function (ele) { 
      return require('./' + slef + '/' + ele)
    }
  })(part[i])
}

global.noop = function () {}
global.page0 = load.page('zero')
global.itis = load.core('itis')
global.clock = load.core('clock')

global.fiz = function (x, fp) { 
  return +(+x).toFixed(fp || 1) 
}

global.lower = function (str) {
  return String(str || '').trim().toLowerCase()
}

global.streql = function (str1, str2) {
  return lower(str1) === lower(str2)
}

global.wordsplit = function (sentn) {
  var _0ln = itis.String(sentn) && sentn.length < 1
  return itis.Empty(sentn) || _0ln ? []: 
    String(sentn).split(/[,\s]+/)
}

global.numsplit = function (nstr) {
  return wordsplit(nstr).map(Number)
}

global.aliasing = function (OBJ, alias) {
  var names = alias.split(' '), one = names.shift()
  names.map(function (als) { OBJ[als] = OBJ[one] })
}

global.synonyms = function (OBJ, aliases) {
  aliases.map(aliasing.bind({}, OBJ)) // hohohoho!!!
}

global.backloop = function (arr, func) {
  arr = Array.isArray(arr)? arr: []
  // func = typeof func == 'function' ? func: noop
  func = itis.Function(func)? func: noop  
  var looped = []
  for (var i = arr.length; i--;) {
    looped.push(func(arr[i], i, arr))
  }
  return looped
}

global.eachprop = function (obj, func) {
  // obj = itis.Object(obj)? obj: {}
  obj = typeof obj == 'object' ? obj: {}
  func = itis.Function(func)? func: noop
  // console.log(obj, func)
  return Object.keys(obj).map(loop)
  function loop (k) { return func(k, obj[k], obj) }
  // do i need a converter into array of [<key>, <value>]-s ?!
  function kvarr (k, val) { return [k, val] }
}

global.directory = function () {
  var dir = path.join.bind({}), _
  // for (_ in arguments) dir = dir.bind({}, arguments[_])
  // arguments.each(function (_, lvl) {
  eachprop(arguments, function (_, lvl) {
    dir = dir.bind({}, lvl) })
  return dir
}

global.copy = function (source, target) {
  // interesting js @ runtime!
  if (itis.Empty(target) || itis.Empty(source)) return

  target = Object(target), source = Object(source)
  // why it needs to be a true property-owner?
  var owned = Object.prototype.hasOwnProperty

  for (var pk in source)
    owned.call(source, pk) && // hohohoho!!!
      (target[pk] = source[pk]);

  return target
}

global.print = function () {
  var _tp = eachprop(arguments, agval)
  process.stdout.write(_tp.join(' '))
  function agval (_, e) { return e }
}
 
module.exports = function () {
  // arguments.each(function (_, argval) {
  eachprop(arguments, function (_, argval) {
    var _p = argval.split(/[.,\s]/)
    if (_p.length <= 1) return
    if (_p.length == 2) _p = _p.slice(-1).concat(_p)
    global[_p[0]] = load[_p[1]](_p[2])
  })
}

if (!!module.parent) {
  var _pf = path.dirname(module.parent.filename)
  _pf = _pf.split(path.sep).slice(-1)[0]

  if (_pf == 'unit') {
    global.broker = load.link('broker')

    global.state = page0.state.local
    if (process.env.NODE_ENV in page0.state) {
      global.state = page0.state[process.env.NODE_ENV]
    }
  }
}

Array.prototype.has = function (x) {
  return this.indexOf(x) > -1
}

Array.prototype.last = function () {
  return this.slice(-1)[0]
}

Object.prototype.each = function (func) {
  return eachprop(this, func)
}