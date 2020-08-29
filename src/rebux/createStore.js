/**
 * @name: createStore
 * @description: 创建一个store实例
 * @param {type} reducers 状态迭代器 required 可以是一个map包含对state多个子对象的迭代，也可以是一个funciton只对整个state对象进行迭代
 * @param {type} initialValue 状态初始值
 * @return: store
 * @Author       : lizhaokang
 * @Date         : 2020-01-18
 */ 
const createStore = (reducers, initialValue = {}, enhancers) => {

  // 如果有增强器，createStore需要被增强器劫持
  if (enhancers && typeof enhancers === 'function') {
    return enhancers(createStore)(reducers, initialValue)
  }

  // valid类型判断
  if (!reducers || (typeof reducers !== 'function')) {
    throw new TypeError('reducers was supposed 2 be a function')
  }

  /* ================= 初始化数据 =================== */
  // 初始化state值
  let _currentState = initialValue
  
  // 这个reducer是单个reducer还是通过combineReducer合成的
  const isCombined = reducers.hasOwnProperty('__map__')

  /* ================= subscribe =================== */

  // dispatch触发，所有state的订阅者都能收到消息
  // 监听函数数组
  const stateListeners = []
  // 范围内订阅
  const rangeListeners = {}
  // 添加订阅函数
  // new feat: 支持对combineReducer后的某个指定reducer进行订阅
  const subscribe = (fn, reducerName) => {
    if (typeof fn === 'function') {
      if (typeof reducerName === 'string') {
        // 订阅某个子reducer
        if (isCombined && reducers['__map__'].hasOwnProperty(reducerName)) {
          // 存在对应的reducer
          rangeListeners[reducerName] = Array.isArray(rangeListeners[reducerName]) ? [ ...rangeListeners, fn ] : [ fn ]
        } else {
          throw new RangeError(`reducer ${reducerName} dont exist in this store`)
        }
      } else {
        // 订阅整个store
        stateListeners.push(fn)
      }
    } else {
      throw new TypeError('subscribe only accept a function')
    }
  }
  // 通知全量订阅函数
  const notify = () => {
    stateListeners.forEach(fn => fn())
  }

  // 通知范围订阅函数
  const rangeNotify = (changedReducers) => {
    Array.isArray(changedReducers) && changedReducers.forEach(reducer => {
      typeof rangeListeners[reducer] === 'function' && rangeListeners[reducer]()
    })
  }

  /* ================== dispatch ==================== */
  const dispatch = action => {
    try {
      if (isCombined) {
        const [ _newState, _changedReducers ] = reducers(_currentState, action)
        _currentState = _newState
        // 通知所有订阅者state更新了
        notify()
        // 通知range订阅者state更新了
        rangeNotify(_changedReducers)
      } else {
        _currentState = reducers(_currentState, action)
        // 通知所有订阅者state更新了
        notify()
      }
    } catch(e) {
      throw new Error(e)
    }
  }

  // 初始化定义了reducer的属性
  // state共有两次初始化
  // 1. initialState的赋值
  // 2. 所有reducer都会运行一次，进行第二次初始化，而action.type不会命中任何逻辑，只会执行default逻辑
  dispatch({
    type: '@@redux_init'
  })

  // 对state进行密封，阻止非dispatch操作造成篡改
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

module.exports = createStore
