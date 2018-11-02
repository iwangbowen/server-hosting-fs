function handleError(err) {
  console.error(err);
}

function timeTaken(callback) {
  console.time('timeTaken');
  const r = callback();
  console.timeEnd('timeTaken');
  return r;
};

module.exports = {
  handleError,
  timeTaken
};
