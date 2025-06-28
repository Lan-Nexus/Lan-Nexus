import run from './run.js';
import updateRegistry from './updateRegistry.js';
import updateRegistryAdmin from './updateRegistryAdmin.js';
import sleep from './sleep.js';

export default ({ _gameDir }) => {
  return {
    run: run({ _gameDir }).action,
    updateRegistry: updateRegistry({ _gameDir }).action,
    updateRegistryAdmin: updateRegistryAdmin({ _gameDir }).action,
    sleep: sleep().action,
  };
};
