// 实现自己的Vuex
// 1、是插件，那么需要实现一个install 方法
// 2、使用了new关键字，那么需要在我们的Vuex中定义一个Store类

let Vue

class Store {
  constructor (options) {
    // 使用'_' '$$' 这类符号是为了不被vue做代理 官方文档有说明

    // 1、保存选项
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrapGetters = options.getters
    // 2、将用户传进来的数据做响应式处理
    // Vue.util.defineRactive(this,'state',this.$options.state)

    // 定义computed 对象
    const computed = {}
    // 暴露getters 对象给用户  类似 $Store.getters.xxx
    this.getters = {}
    // 赋值下this指向
    const Store = this
    Object.keys(this._wrapGetters).forEach(key => {
      // 1 、 获取用户的getters
      // 注意 : 此时得到的是一个带有param 的 function ,需要做下封装，封装成computed 类型的无 param 的 function
      const fn = Store._wrapGetters[key]
      computed[key] = function () {
        return fn(Store.state)
      }
      // 2、为getters定义只读属性
      Object.defineProperty(Store.getters, key, {
        get: () => Store._vm[key]
      })
    })
    this._vm = new Vue({
      data () {
        return {
          $$state: options.state
        }
      },
      computed
    })
    // 绑定上下文, 确保是store 实例
    this.commit = this.commit.bind(this)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    // 注意，此时必须有一个形参接收，否则会报错
    console.error('Please use replaceState to reset state')
  }

  // 实现一个 cimmit 方法

  commit (type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('unknown mutations')
      return
    }
    entry(this.state, payload)
  }

  // 实现一个 dispatch 方法

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknown actions')
      return
    }
    entry(this, payload)
  }
}

function install (_Vue) {
  Vue = _Vue
  // 注册$store
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// 导出Vuex 对象
export default { Store, install }
