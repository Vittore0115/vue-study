// 编写一个MyVue类
class MyVue {
  constructor (options) {
    // 1、保存选项
    this.$options = options
    this.$data = options.data
    // 2、对data选项做响应式处理
    obserable(this.$data)
    // 2.5、代理
    proxy(this)
    // 编译
    new Compile(options.el, this)
  }
}

function obserable (obj) {
  // 判断obj的值，必须是object
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function proxy (vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (v) {
        vm.$data[key] = v
      }
    })
  })
}

class Compile {
  constructor (el, vm) {
    // 保存MyVue实例
    this.$vm = vm
    // 编译模板树
    this.compile(document.querySelector(el))
  }

  // el模板根节点
  compile (el) {
    // 遍历el
    // 1、获取el所有子节点
    el.childNodes.forEach((node) => {
      // 2、判断node类型
      if (node.nodeType === 1) {
        // 元素
        console.log('element', node.nodeName)
        this.createElement(node)
      }
    })
  }

  createElement (node) {
    // 1、获取当前元素的所有属性，并判断它们是不是动态的
    const Attrbutes = node.attributes
    Array.from(Attrbutes).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value
      // 判断attrName是否是指令或事件等动态
      if (attrName.startsWith('my-')) {
        // 指令
        // 截取my-后面的部分，特殊处理
        const dir = attrName.substring(3)
        // 判断是否存在指令处理函数，若存在则调用它
        this[dir] && this[dir](node, exp)
      }
    })
  }

  // 处理my-html
  html (node, exp) {
    node.innerHTML = this.$vm[exp]
  }

  // 处理my-text
  text (node, exp) {
    node.textContent = this.$vm[exp]
  }
}

function defineReactive (obj, key, val) {
  // 如果val本身还是对象，则需要递归处理
  obserable(val)

  Object.defineProperty(obj, key, {
    get () {
      console.log('get:', key)
      return val
    },
    set (v) {
      if (val !== v) {
        val = v
      }
      obserable(v)
      console.log('set:', key)
    }
  })
}
