import { useCallback } from "react";
import { useAudioPlayer } from "expo-audio";

export function useSudokuSonidos(habilitado: boolean) {
  const toque = useAudioPlayer(require("../../assets/audio/soft-tap.wav"));
  const victoria = useAudioPlayer(require("../../assets/audio/win-chime.wav"));

  const reproducirToque = useCallback(() => {
    if (!habilitado) {
      return;
    }

    toque.seekTo(0);
    toque.play();
  }, [habilitado, toque]);

  const reproducirVictoria = useCallback(() => {
    if (!habilitado) {
      return;
    }

    victoria.seekTo(0);
    victoria.play();
  }, [habilitado, victoria]);

  return {
    reproducirToque,
    reproducirVictoria,
  };
}
