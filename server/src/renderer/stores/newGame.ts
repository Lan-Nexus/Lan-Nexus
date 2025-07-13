import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNewGameStore = defineStore('newGame', () => {
  const gameId = ref<string | null>(null);
  const gameInfo = ref(null);
  const selectedIcon = ref(null);
  const selectedLogo = ref(null);
  const selectedHero = ref(null);
  const selectedGrid = ref(null);
  const selectedCard = ref(null);
  const currentStep = ref(0);

  function setGameId(id: string | null) {
    gameId.value = id;
  }
  function setGameInfo(info: any) {
    gameInfo.value = info;
  }
  function setSelectedIcon(icon: any) {
    selectedIcon.value = icon;
  }
  function setSelectedLogo(logo: any) {
    selectedLogo.value = logo;
  }
  function setSelectedHero(hero: any) {
    selectedHero.value = hero;
  }
  function setSelectedGrid(grid: any) {
    selectedGrid.value = grid;
  }
  function setSelectedCard(card: any) {
    selectedCard.value = card;
  }

  function reset() {
    gameId.value = null;
    gameInfo.value = null;
    selectedIcon.value = null;
    selectedLogo.value = null;
    selectedHero.value = null;
    selectedGrid.value = null;
    selectedCard.value = null;
    currentStep.value = 0;
  }

  async function save(gamesStore: any, router: any) {
    const res = await gamesStore.createGame({
      gameID: gameId.value,
      name: (gameInfo.value as any)?.game?.name,
      description: (gameInfo.value as any)?.game?.name,
      icon: (selectedIcon.value as any)?.url,
      headerImage: (selectedHero.value as any)?.url,
      logo: (selectedLogo.value as any)?.url,
      imageCard: (selectedCard.value as any)?.url,
      heroImage: (selectedHero.value as any)?.url,
      type: 'archive',
      install: '',
      uninstall: '',
      play: 'await run(GAME_EXECUTABLE);',
      needsKey: 0,
      status: 'Draft',
    });
    if (res) {
      console.log('Game created successfully:', res);
      router.push({ name: 'editGame', params: { id: String(res.id) } });
      // Use the store's own reset method
      reset();
    } else {
      console.error('Failed to create game');
    }
  }

  return {
    gameId,
    gameInfo,
    selectedIcon,
    selectedLogo,
    selectedHero,
    selectedGrid,
    selectedCard,
    currentStep,
    setGameId,
    setGameInfo,
    setSelectedIcon,
    setSelectedLogo,
    setSelectedHero,
    setSelectedGrid,
    setSelectedCard,
    // setCurrentStep,
    // nextStep,
    // prevStep,
    reset: reset,
    save,
  };
});
