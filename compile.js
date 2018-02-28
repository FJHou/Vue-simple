const nodeType = {
  isElement: function (node) {
    return node.nodeType === 1
  },
  isText: function (node) {
    return node.nodeType === 3
  }
}

const updater = {
  text: function (node, val) {
    node.textContent = val
  }
}

const Compile = function (el, vm) {
  // view-model (#app)
  this.vm = vm
  this.el = document.querySelector(el)
  this.fragment = null
  this.init()
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    }
  },

  nodeToFragment: function (el) {
    const fragment = document.createDocumentFragment()
    let child = el.firstChild

    while (child) {
      // console.log(child)
      fragment.appendChild(child)
      child = el.firstChild
    }

    return fragment
  },

  compileElement: function (el) {
    const childNodes = el.childNodes

    Array.prototype.slice.call(childNodes).forEach((node) => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent

      if (nodeType.isElement(node)) {
        this.compileEl(node)
      } else if (nodeType.isText(node) && reg.test(text)) {
        // reg.exec 返回一个数组。如果没有则返回null.
        // 第一项为匹配的内容，第二项为这个字母，第三项为输入的值，也就是test
        this.compileText(node, reg.exec(text)[1])
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  },

  compileText: function (node, exp) {
    const value = this.vm[exp.trim()]

    updater.text(node, value)
    new Watcher(this.vm, exp, function (val) {
      updater.text(node, val)
    })
  },

  compileEl: function (node) {
    const attrs = node.attributes;
    Object.values(attrs).forEach(function (attr) {
      var name = attr.name

      if (name.indexOf('v-') >= 0) {
        const exp = attr.value
        const eventDir = name.substring(2)
        if (eventDir.indexOf('on') >= 0) {
          this.compileEvent(node, eventDir, exp)
        }
      }
    }.bind(this))
  },

  compileEvent: function(node, dir, exp) {
    const eventType = dir.split(':')[1]
    const cb = this.vm.methods[exp]
    if(eventType && cb) {
      node.addEventListener(eventType, cb.bind(this.vm))
    }
  }
}

