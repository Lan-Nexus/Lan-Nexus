import path from 'path';

export default async (gameName,func,args = []) => {

  let gameDir = path.join(__dirname, '../../games');

  gameDir = path.join(gameDir, gameName);

  const file = await import(`${gameDir}/lanLauncher.mjs`);

  return file[func](gameDir,...args);
}
