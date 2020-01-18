const a = {}
Object.defineProperty(a, '_say', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: function () {
    console.log("??")
  }
})

console.log(Object.keys(a))
a._say()