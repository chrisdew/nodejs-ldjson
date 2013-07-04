exports.tested = tested
exports.notTested = notTested

function tested() {
  var word;
  if (1 > 2) {
    // this limb is not tested
    word = "not ";
  } else {
    // this limb is tested
    word = "";
  }
  return "this function is " + word + "tested";
}

function notTested() {
  return "this function is not tested";
}