// 1、实现数据响应式
// - vue2 Object.defineProperty(obj,key,desc)
// - vue3 new Proxy()
// 2、设置obj的key，拦截它，初始值val
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

function obserable (obj) {
  // 判断obj的值，必须是object
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

// function set (obj, key, val) {
//   defineReactive(obj, key, val)
// }

const obj = {
  name1: 'Zhangsan',
  name2: 'Lisi',
  baz: {
    a: 1
  },
  arr: [1, 2, 3]
}

// 对obj 做响应式处理
// defineReactive(obj,'name1','Zhangsan')
obserable(obj)

// 此时访问对象中存在的Key,正常可以get、set
// obj.name1
// obj.name1 = 'zwt'

// 此时baz是一个对象，故需要进行递归处理
// obj.baz
// obj.baz.a

// 此时baz中的a若传入一个对象，也需要在set 的时候进行递归处理
// obj.baz.a = {A : 'A'}
// obj.baz.a.A

// 此时obj对象中不存在insert 这个 key, 故在vue2 中对其进行了一个处理
// set(obj, 'insert', 'val')
// obj.insert
// obj.insert = 'val2'

// 若数组只是这样子访问与修改，则也可以触发get、set
// obj.arr
// obj.arr = [4,5,6]

// 但用户通常不是这样子去操作的，会对数组进行unshift、push等等这些操作
// 故需要覆盖数组中的变更方法
// obj.arr.push(4,5,6)
