
/**
 * 一个 middleware的例子
 * 记录所有被发起的 action 以及产生的新的 state。
 */
// const logger = store => next => action => {
//   console.group(action.type)
//   console.info('dispatching', action)
//   let result = next(action)
//   console.log('next state', store.getState())
//   console.groupEnd(action.type)
//   return result
// }


/**
 * 一个curry化函数，用于包裹默认的dispatch方法
 * @param  {...any} middlewares 中间件
 */
export default function applyMiddleware (...middlewares) {
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState)
    // 兜底
    let dispatch = () => {
      throw new Error('you cant call dispatch while it is constructing')
    }
    // 暴露给中间件函数的API只有这两个
    const exposeStoreAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => store.dispatch(action, ...args)
    }
    
    dispatch = compose(middlewares.map(middleware => middleware(exposeStoreAPI)))(store.dispatch)

    store.dispatch = dispatch
    return store
  }
}

// 包裹再包裹
// 最后返回的是一个 dispatch => action => void，所以还需要传入一个底层农民工函数 store.dispatch
function compose (funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((prev, cur) => (...args) => prev(cur(...args)), a => a)
}

