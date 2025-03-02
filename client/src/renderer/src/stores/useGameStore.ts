import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import gamesdata from '../assets/games.js'

export const useGameStore = defineStore('game', () => {
  const games = ref(gamesdata)

  console.log(games.value)

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

  return { games, selectedGame, selectedArchive, selectGame, installArchive, uninstallArchive }
})
