<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  type Props = { path: string } & HTMLAttributes<SVGElement>;
  let { path, ...rest }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  {...rest}
  class={`icon ${rest.class}`}
>
  <path d={path} />
</svg>

<style>
  .icon {
    --size: 30px;
    width: var(--size);
    height: var(--size);
    display: inline-block;
  }
  path {
    fill: currentColor;
  }
</style>
