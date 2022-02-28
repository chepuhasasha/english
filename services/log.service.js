import chalk from "chalk";

export default {
  word({ word, translate, topic, example }) {
    console.log(
      `${chalk.gray(topic.toUpperCase())}\n\n${chalk.bgBlueBright(
        chalk.black(` ${word} `)
      )} ${translate} \n\n ${chalk.grey(chalk.italic(example))}\n`
    );
  },
  clearLog() {
    console.log("\x1Bc");
  },
};
