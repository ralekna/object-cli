function evaluateInContext(source, context) {
  return (new Function(`return ${source}`)).call(context);
}

module.exports = {
  evaluateInContext
};