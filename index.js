const Vue = function (opts) {
  this.data = opts.data;
  this.methods = opts.methods
  this.mounted = opts.mounted
  this.el = opts.el

  this.init()
}

Vue.prototype = {
  init: function () {
    Object.keys(this.data).forEach((key) => {
      this.proxy(key)
    })

    observe(this.data, this)

    const compile = new Compile(this.el, this)

    this.callHook('mounted')
  },

  proxy: function (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function () {
        return this.data[key]
      },
      set: function (val) {
        return this.data[key] = val
      }
    })
  },

  callHook: function (lifeCircle) {
    this[lifeCircle]()
  }
}