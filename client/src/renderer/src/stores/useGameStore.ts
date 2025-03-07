import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

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

  function installArchive(archiveName: string) {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    const archive = game.archives.find((archive) => archive.name === archiveName)
    archive.isInstalled = true
  }

  function uninstallArchive(archiveName: string) {
    const game = games.value.find((game) => game.id === selectedGameId.value)
    const archive = game.archives.find((archive) => archive.name === archiveName)
    archive.isInstalled = false
  }

  function loadGames(){
    axios.get('http://localhost:3000/api/games').then((response) => {
      games.value = response.data
    })
  }

  function play(){
    if(selectedGame.value.type === 'steam'){
      document.location.href = `steam://launch/${selectedGame.value.id}/dialog`
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
    play
  }
})
