import { onDestroy } from "svelte";

export function useMediaQuery(query: string) {
  const mediaQuery = window.matchMedia(query);
  let result = $state({match:false});
  const updateState = () => {
    console.log("mediaQuery change", query, mediaQuery.matches)
    result.match = mediaQuery.matches;
  };
  mediaQuery.addEventListener('change', updateState);
  updateState();
  const clear = () => mediaQuery.removeEventListener('change', updateState);
  onDestroy(clear);

  return result
}
