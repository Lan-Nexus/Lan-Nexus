export type gameKey = {
  id: number;
  key: string;
  gameId: number;
  ipAddress: string;
};

export type gameState = {
  description: string;
  gameID: string;
  id: number;
  name: string;
  type: string;
  heroImage: string;
  headerImage: string;
  logo: string;
  icon: string;
  gamekey?: gameKey;
  archives: string;
  install: string;
  uninstall: string;
  play: string;
  isInstalled?: boolean; // Added property
  needsKey: boolean;
  executable: string;
};