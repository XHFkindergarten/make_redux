/**
 * @name: combineReducers
 * @description: 将多个reducer迭代器合并成为一个
 * @param {Object} map 属性名为目标更新的state属性名 
 * @param {Array} state state
 * @return: {Function}
 * @Author       : lizhaokang
 * @Date         : 2020-01-18
 */
const combineReducers = map => {
  const reducerContainer = (states, action) => {
    // 生成一个栈地址发生了改变的新state
    let _newState = {}
    try {
      // 收集发生了改变的reducer name
      const changedReducers = []
      for(let i of Object.keys(map)) {
        // 依次执行reducers方法,依次更新state(前提是提供了这个属性的reducer方法)
        _newState[i] = map[i](states[i], action)
        if (_newState[i] !== states[i]) {
          changedReducers.push(i)
        }
      }
      // 返回和state初始值合并之后の密封对象, 以及发生了改变的reducer name
      return [ Object.seal(Object.assign({}, states, _newState)), changedReducers ]
    } catch (e) {
      throw new Error(e)
    }
  }
  // 将reducer的组织结构存储在函数的__map__上
  Object.defineProperty(reducerContainer, '__map__', {
    value: map,
    enumerable: false,
    writable: false,
    configurable: false
  })
  return reducerContainer
}

module.exports = combineReducers