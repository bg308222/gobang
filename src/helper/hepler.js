function* turn() {
  let isBlack = true;
  while (true) {
    yield isBlack ? "b" : "w";
    isBlack = !isBlack;
  }
}

export const DIRECTION = {
  left: -1,
  right: 1,
  top: -15,
  down: 15,
};

export const turnGenerator = turn();
