function foo(params) {
  var _array = "0|4|3|2|1".split("|"),
    _index = 0;
  while (!![]) {
    switch (+_array[_index++]) {
      case 0:
        var a = 1;
        continue;
      case 1:
        return d;
        continue;
      case 2:
        var d = c + 1;
        continue;
      case 3:
        var c = b + 1;
        continue;
      case 4:
        var b = a + 1;
        continue;
    }
    break;
  }
}
console.log(foo());