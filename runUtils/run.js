import path from "path";
import { execFile } from "child_process";

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
        // Split cmdPath into directory and file
        const dir = path.dirname(cmdPath);
        const file = path.basename(cmdPath);
        const runDir = path.join(_gameDir, dir);
        const fullPath = path.join(runDir, file);
        console.log(`Running command: ${fullPath} in directory: ${runDir}`);
        execFile(fullPath, { cwd: runDir }, (error, stdout, stderr) => {
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


