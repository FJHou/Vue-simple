const Watcher = function (vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.get()
}

Watcher.prototype = {
  get: function () {
    Dep.target = this
    const value = this.vm.data[this.exp.trim()]
    Dep.target = null
    return value
  },

  update: function () {
    const newVal = this.vm.data[this.exp.trim()]
    if (this.value !== newVal) {
      this.value = newVal
      this.cb.call(this.vm, newVal)
    }
  }
}