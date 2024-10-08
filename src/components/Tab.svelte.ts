export function createTabState<T>(active: T) {
  const state = $state({
    active
  });
  return [state,
    {
      isActived(tab: T) {
        return tab == state.active
      },
      setActive(tab: T) {
        state.active = tab
      }
    }
  ] as const;
}
