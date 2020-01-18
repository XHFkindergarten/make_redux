/**
 * @name: createStore
 * @description: 创建一个store实例
 * @param {type} reducers 状态迭代器 required 可以是一个map包含对state多个子对象的迭代，也可以是一个funciton只对整个state对象进行迭代
 * @param {type} initialValue 状态初始值
 * @return: store
 * @Author       : lizhaokang
 * @Date         : 2020-01-18 16:11:10
 */ 
const createStore = (reducers, initialValue = {}) => {
  // valid类型判断
  if (!reducers || typeof reducers !== 'function' || typeof reducers !== 'object') {
    throw new TypeError('reducers was supposed 2 be a object or a function')
  }

  /* ================= 初始化数据 =================== */
  // 初始化state值
  let _currentState = initialValue
  // state内所有属性名数组
  const _keyArr = Object.keys(_currentState)

  /* ================= subscribe =================== */

  // dispatch触发，所有state的订阅者都能收到消息
  // 监听函数数组
  const stateListeners = []
  // 添加订阅函数
  const subscribe = fn => {
    if (typeof fn === 'function') {
      stateListeners.push(fn)
    } else {
      throw new TypeError('subscribe only accept a function')
    }
  }
  // 通知事件
  const notify = () => {
    stateListeners.forEach(fn => {
      fn()
    })
  }
  /* ================== dispatch ==================== */
  const dispatch = async action => {
    try {
      _currentState = await reducers(_currentState)(action)
      // 通知所有订阅者state更新了
      notify()
    } catch(e) {
      throw new Error(e)
    }
  }
  // 初始化
  dispatch({
    type: '@@redux_init'
  })
  // 对state进行密封，阻止非reducer形式的篡改
  Object.seal(_currentState)
  return {
    // get方法
    getState: () => _currentState,
    // set方法
    dispatch,
    // 添加订阅事件
    subscribe
  }
}
