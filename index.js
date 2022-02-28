#!/ust/bin/env node

import { readFile, writeFile } from "fs/promises";
import inquirer from "inquirer";
import cnsl from "./services/log.service.js";

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
  cnsl.clearLog();
  getWord();
  chain(
    {
      type: "list",
      name: "command",
      message: "COMMAND",
      choices: ["GET WORD", "ADD NEW WORD", "ADD NEW TOPIC", "QUIT"],
    },
    (result) => {
      switch (result.command) {
        case "ADD NEW WORD":
          AddWord((res) => {
            console.log(res);
            init();
          });
          break;
        case "ADD NEW TOPIC":
          AddTopic((res) => {
            console.log(res);
            init();
          });
          break;
        case "GET WORD":
          getWord(() => {
            init();
          });
          break;

        case "QUIT":
          break;

        default:
          break;
      }
    }
  );
};

const AddWord = (next) => {
  cnsl.clearLog();
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
  cnsl.clearLog();
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

const getWord = (next) => {
  cnsl.clearLog();
  const num = Math.floor(Math.random() * data.words.length);
  cnsl.word(data.words[num]);
  if (next) {
    next();
  }
};

init();
