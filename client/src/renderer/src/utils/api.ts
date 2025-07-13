import axios from 'axios';

export async function reserveGameKey(serverAddress: string, gameId: number, clientId: string) {
  const response = await axios.post(
    `${serverAddress}/api/games/${gameId}/keys/reserve`,
    {clientId},
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data;
}

export async function releaseGameKey(serverAddress: string, gameId: number, keyId: number) {
  return axios.post(`${serverAddress}/api/games/${gameId}/keys/${keyId}/release`);
}

export async function loadGames(serverAddress: string,clientId: string) {
  const response = await axios.get(`${serverAddress}/api/games?clientId=${clientId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
}

export async function getIpAddress(serverAddress: string) {
  const response = await axios.get(`${serverAddress}/api/ip`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.ip;
} 