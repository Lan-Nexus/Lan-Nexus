export default function run(cmdPath) {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(gameDir, cmdPath);
      exec(fullPath, { cwd: gameDir }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
