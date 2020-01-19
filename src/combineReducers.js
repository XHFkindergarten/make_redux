/**
 * @name: combineReducers
 * @description: 将多个reducer迭代器合并成为一个
 * @param {Object} map 属性名为目标更新的state属性名 
 * @param {Array} state state
 * @return: {Function}
 */
const combineReducers = map => states => action => {
  // 生成一个栈地址发生了改变的新state(没有理由,因为没想好为什么要返回新的state对象而不是改变原有的state对象)
  let _newState = {}
  try {
    for(let i of Object.keys(map)) {
      // 依次执行reducers方法,依次更新state(前提是提供了这个属性的reducer方法)
      _newState[i] = map[i](states[i], action)
    }
    // 返回和state初始值合并之后の密封对象
    Object.seal(_newState)
    return Object.seal(Object.assign({}, states, _newState))
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = combineReducers