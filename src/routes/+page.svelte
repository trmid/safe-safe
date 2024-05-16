<script>
  import Safe from '$lib/Safe.svelte'
  import { walletClient } from '$lib/stores'
</script>

<svelte:head>
  <title>Safe Safe</title>
  <meta name="description" content="Safe safe for safety." />
</svelte:head>

{#if !!$walletClient}
  <Safe wallet={$walletClient}></Safe>
{/if}
