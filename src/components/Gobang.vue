<template>
  <div id="board-container">
    <img alt="Vue logo" src="../assets/board.jpg" />
    <div
      id="selected-position"
      v-if="selectedPosition"
      :style="{ ...getChessStyle(getChessCoord(selectedPosition)) }"
      @click="handleSelectedPositionClick()"
    ></div>
    <button @click="handleRegret">REGRET</button>
    <button @click="handleRestart">RESTART</button>
    <div :style="{ color: 'white' }" v-if="winner">
      {{ winner === "b" ? "BLACK" : "WHITE" }} WIN!
    </div>
    <div id="turn" :style="{ backgroundColor: getChessColor(turn) }"></div>
    <div
      v-for="(status, position) in board"
      class="position"
      :style="{
        ...getChessStyle(getChessCoord(position)),
        backgroundColor: getChessColor(status),
      }"
      @click="handlePositionClick(position)"
    ></div>
  </div>
</template>

<script>
import { turnGenerator, DIRECTION } from "../helper/hepler";
export default {
  name: "Gobang",
  //   props: {
  //     msg: String,
  //   },
  data() {
    return {
      board: [...new Array(225)].map(() => "n"),
      turn: turnGenerator.next().value,
      selectedPosition: null,
      winner: null,
      history: [],
    };
  },
  methods: {
    toggleTurn() {
      this.turn = turnGenerator.next().value;
    },
    getChessColor(status) {
      switch (status) {
        case "b":
          return "black";
        case "w":
          return "white";
        default:
          return undefined;
      }
    },
    getChessCoord(position) {
      const x = position % 15;
      const y = Math.floor(position / 15);

      return { x, y };
    },
    getChessStyle({ x, y }) {
      return {
        top: `${18 + y * 63.5}px`,
        left: `${23 + x * 66.5}px`,
      };
    },
    checkIsValid(originPosition, newPosition) {
      const originCoord = this.getChessCoord(originPosition);
      const newCoord = this.getChessCoord(newPosition);
      // left boundary
      if (originCoord.x === 0 && newCoord.x === 14) return false;
      // right boundary
      if (originCoord.x === 14 && newCoord.x === 0) return false;
      // top boundary
      if (originCoord.y < 0) return false;
      // down boundary
      if (originCoord.y > 14) return false;

      return true;
    },
    getContinuousChessCount(position, direction) {
      let count = 0;
      let tempPosition = position;
      while (this.checkIsValid(tempPosition, tempPosition + direction)) {
        if (this.turn !== this.board[tempPosition + direction]) break;
        count++;
        tempPosition = tempPosition + direction;
      }
      return count;
    },
    handlePositionClick(position) {
      if (this.board[position] !== "n") {
        this.selectedPosition = null;
        return;
      }
      this.selectedPosition = position;
    },
    handleSelectedPositionClick() {
      this.winner = this.getWinner;
      if (this.winner) return;

      this.history.push(
        JSON.parse(JSON.stringify({ turn: this.turn, board: this.board }))
      );
      this.board[this.selectedPosition] = this.turn;
      this.selectedPosition = null;
      this.turn = turnGenerator.next().value;
    },
    handleRegret() {
      if (this.history.length === 0) return;

      const lastStep = this.history[this.history.length - 1];
      this.selectedPosition = null;
      this.turn = lastStep.turn;
      this.board = lastStep.board;
      this.history = this.history.slice(0, this.history.length - 1);
    },
    handleRestart() {
      this.selectedPosition = null;
      this.turn =
        turnGenerator.next().value === "b" ? "b" : turnGenerator.next().value;
      this.board = [...new Array(225)].map(() => "n");
      this.history = [];
    },
  },
  computed: {
    getWinner() {
      // right to left
      if (
        this.getContinuousChessCount(this.selectedPosition, DIRECTION.left) +
          this.getContinuousChessCount(
            this.selectedPosition,
            DIRECTION.right
          ) ===
        4
      )
        return this.turn;
      // top to down
      if (
        this.getContinuousChessCount(this.selectedPosition, DIRECTION.top) +
          this.getContinuousChessCount(
            this.selectedPosition,
            DIRECTION.down
          ) ===
        4
      )
        return this.turn;
      // right-top to left-down
      if (
        this.getContinuousChessCount(
          this.selectedPosition,
          DIRECTION.right + DIRECTION.top
        ) +
          this.getContinuousChessCount(
            this.selectedPosition,
            DIRECTION.left + DIRECTION.down
          ) ===
        4
      )
        return this.turn;
      // left-top to right-down
      if (
        this.getContinuousChessCount(
          this.selectedPosition,
          DIRECTION.left + DIRECTION.top
        ) +
          this.getContinuousChessCount(
            this.selectedPosition,
            DIRECTION.right + DIRECTION.down
          ) ===
        4
      )
        return this.turn;

      return null;
    },
  },
};
</script>

<style>
#board-container {
  position: absolute;
  left: 10px;
  z-index: 0;
}

#selected-position {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: rgba(121, 88, 46, 0.616);
  z-index: 2;
}

#turn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}

.position {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  z-index: 1;
}
</style>
