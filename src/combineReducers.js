/**
 * @name: combineReducers
 * @description: 将多个reducer迭代器合并成为一个
 * @param {Object} map 属性名为目标更新的state属性名 
 * @param {Array} state state
 * @return: {Function}
 */
const combineReducers = map => states => action => {
  // 生成一个栈地址发生了改变的新state(没有理由,因为没想好为什么要返回新的state对象而不是改变原有的state对象)
  let newState = {}
  try {
    for(let i in states) {
      // 依次执行reducers方法,依次更新state
      Object.assign(_newState, i, map[i](states[i], action))
    }
    // 密封对象
    Object.seal(newState)
    return newState
  } catch (e) {
    throw new Error(e)
  }
}
