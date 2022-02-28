import chalk from "chalk";

export default {
  word({ word, translate, topic, example }) {
    console.log(
      `${chalk.gray(topic.toUpperCase())}\n${chalk.bgMagentaBright(
        chalk.black(` ${word} `)
      )} ${translate} \n ${chalk.grey(example)}`
    );
  },
  clearLog() {
    console.log("\x1Bc");
  },
};
