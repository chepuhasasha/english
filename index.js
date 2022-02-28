#!/ust/bin/env node

import { readFile, writeFile } from "fs/promises";
import inquirer from "inquirer";

const data = JSON.parse(
  await readFile(new URL("./data/words.json", import.meta.url))
);

const chain = (question, next, accum = null) => {
  if (accum === null) {
    accum = {};
  }
  inquirer.prompt(question).then((answer) => {
    accum[question.name] = answer[question.name];
    if (question.next) {
      chain(question.next, next, accum);
    } else {
      next(accum);
    }
  });
};

const init = () => {
  chain(
    {
      type: "list",
      name: "mode",
      message: "Mode:",
      choices: ["Добавить новое слово", "Добавить тему", "Тренировка", "Выход"],
    },
    (result) => {
      switch (result.mode) {
        case "Добавить новое слово":
          AddWord((res) => {
            console.log(res);
            init();
          });
          break;
        case "Добавить тему":
          AddTopic((res) => {
            console.log(res);
            init();
          });
          break;
        case "Тренировка":
          train((res) => {
            console.log(res);
            init();
          });
          break;

        case "Выход":
          break;

        default:
          break;
      }
    }
  );
};

const AddWord = (next) => {
  chain(
    {
      type: "string",
      name: "word",
      message: "WORD: ",
      next: {
        type: "string",
        name: "translate",
        message: "TRANSLATE: ",
        next: {
          type: "list",
          name: "topic",
          message: "TOPIC: ",
          choices: data.topics,
          next: {
            type: "string",
            name: "example",
            message: "EXAMPLE: ",
          },
        },
      },
    },
    (result) => {
      data.words.push(result);
      writeFile(
        "./data/words.json",
        JSON.stringify(data, null, 2),
        next(result)
      );
    }
  );
};

const AddTopic = (next) => {
  chain(
    {
      type: "string",
      name: "topic",
      message: "TOPIC TITLE: ",
    },
    (result) => {
      data.topics.push(result.topic);
      writeFile(
        "./data/words.json",
        JSON.stringify(data, null, 2),
        next(result.topic)
      );
    }
  );
};

const train = () => {
  chain(
    {
      type: "number",
      name: "size",
      message: "How many words?",
    },
    (result) => {
      console.log(result);
      next();
    }
  );
};

init();
