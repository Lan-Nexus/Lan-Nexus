import path from "path";
import { exec } from "child_process";

export default function ({ _gameDir }) {
  return {
    name: "run",
    description: "Runs a command in the game directory using Node.js child_process.exec",
    usage: "run COMMAND_PATH",
    args: [
      {
        name: "COMMAND_PATH",
        description: "The path to the command to run, relative to the game directory.",
        required: true,
      },
    ],
    action(cmdPath) {
      return new Promise((resolve, reject) => {
        const fullPath = path.join(_gameDir, cmdPath);
        exec(fullPath, { cwd: _gameDir }, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });
    }
  };
}


