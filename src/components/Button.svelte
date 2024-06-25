<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    variant = "primary",
    ...rest
  }: HTMLButtonAttributes & {
    variant?: "primary" | "primary-outline";
  } = $props();
  let cls = $derived(
    `button ${variant === "primary" ? "is-primary" : "primary-outline"}`,
  );
</script>

<button class={cls} {...rest}>
  <slot />
</button>

<style>
  .is-primary {
    color: var(--bulma-primary-100);
  }
</style>
