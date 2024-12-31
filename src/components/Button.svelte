<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    variant = "primary",
    onclick: onclick,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: "primary" | "primary-outline";
    onclick?: (e: MouseEvent) => void | Promise<void>;
  } = $props();

  let isLoading = $state(false);

  let cls = $derived(
    `button ${variant === "primary" ? "is-primary" : "primary-outline"} ${isLoading ? "is-loading" : ""}`,
  );

  async function handleClick(e: MouseEvent) {
    if (onclick) {
      try {
        isLoading = true;
        await onclick(e);
      } finally {
        isLoading = false;
      }
    }
  }
</script>

<button class={cls} 
  {...rest}
  onclick={handleClick}
  disabled={isLoading || rest.disabled}
>
  <slot />
</button>

<style>
  .is-primary {
    color: var(--bulma-primary-100);
  }
</style>
