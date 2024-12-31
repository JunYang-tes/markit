<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    variant = "primary",
    onclick: onclick,
    children,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: "primary" | "primary-outline";
    children: Snippet
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
  {@render children()}
</button>

<style>
  .is-primary {
    color: var(--bulma-primary-100);
  }
</style>
