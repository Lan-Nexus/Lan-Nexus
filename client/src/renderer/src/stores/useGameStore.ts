import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import functions from '../functions.js'
import gameslocal from '../assets/games.js'

export const useGameStore = defineStore('game', () => {
  const games = ref([])

  const selectedGameId = ref(1)

  const selectedGame = computed(() => {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    console.log(game.name)
    return game
  })

  const selectedArchive = computed(() => {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    const archive = game.archives.find((archive) => archive.id === game.selectedArchive)
    console.log(archive.name)
    return archive
  })

  function selectGame(id: number) {
    selectedGameId.value = id
  }

  async function installArchive(archiveName: string) {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    const archive = game.archives.find((archive) => archive.id === game.selectedArchive)

    const safeName = game.name.replaceAll(' ', '-')
    const archiveFile = safeName + '/' + archive.name

    try {
      await functions.download(archive.file, archiveFile + '.zip')
      await functions.unzip(archiveFile + '.zip', archiveFile)
      await functions.run(archiveFile,'install');
      await functions.clearTemp()
    } catch (error) {
      console.error(error)
    }

    archive.isInstalled = true
  }

  async function uninstallArchive(archiveName: string) {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    const archive = game.archives.find((archive) => archive.id === game.selectedArchive)

    try {
      await functions.run(archive.name,'uninstall');
    } catch (error) {
      console.error(error)
    }

    archive.isInstalled = false
  }

  function loadGames(){
    games.value = gameslocal;
    return;
    axios.get('http://localhost:3000/api/games').then((response) => {
      games.value = response.data
    })
  }

  async function play(){
    if(selectedGame.value.type === 'steam'){
      document.location.href = `steam://run/${selectedGame.value.id}`
    }
    if(selectedGame.value.type === 'zip'){
      const game = games.value.find((game) => game.id === selectedGameId.value)
      const archive = game.archives.find((archive) => archive.id === game.selectedArchive)
      const safeName = game.name.replaceAll(' ', '-')
      const archiveFile = safeName + '/' + archive.name
      await functions.run(archiveFile,'play');
    }
  }

  loadGames();

  return {
    games,
    selectedGame,
    selectedArchive,
    selectGame,
    installArchive,
    uninstallArchive,
    play,
    reload: loadGames
  }
})
