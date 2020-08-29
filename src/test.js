const combineReducers = require('./rebux/combineReducers')
const createStore = require('./rebux/createStore')

const initialState = {
  name: 'XHFk1nd3rgarten',
  count: 0,
  date: '2020-01-19'
}
const addCountType = 'ADD_COUNT_TYPE'
const updateNameType = 'UPDATE_NAME'

const countReducer = (state = 0, action) =>{
  switch (action.type) {
    case addCountType:
      return state + 1
    default:
      return state
  }
}

const nameReducer = (state = 'XHFkindergarten', action) => {
  switch (action.type) {
    case updateNameType:
      return action.value
    default:
      return state
  }
}

const reducers = combineReducers({
  count: countReducer,
  name: nameReducer
})

const store = createStore(reducers, initialState)
console.log(store.getState())
setTimeout(() => {
  store.dispatch({
    type: addCountType
  })
  console.log(store.getState())
}, 1000)

setTimeout(() => {
  store.dispatch({
    type: updateNameType,
    value: '李肇康'
  })
  console.log(store.getState())
}, 2000)

store.subscribe(() => {
  console.log('store subscribe function')
})
