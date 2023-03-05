function foo(params) {
  var _array = "1|2|3|4|0".split("|"),
    _index = 0;
  while (!![]) {
    switch (+_array[_index++]) {
      case 0:
        return d;
      case 1:
        var a = 1;
        continue;
      case 2:
        var b = a + 1;
        continue;
      case 3:
        var c = b + 1;
        continue;
      case 4:
        var d = c + 1;
        continue;
    }
    break;
  }
}
console.log(foo());