export default function () {
  return {
    name: "sleep",
    description: "Waits for a specified number of milliseconds before resolving.",
    usage: "sleep MILLISECONDS",
    args: [
      {
        name: "MILLISECONDS",
        description: "The number of milliseconds to sleep.",
        required: true,
      },
    ],
    action(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };
}
