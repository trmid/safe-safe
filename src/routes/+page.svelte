<script>
  import Safe from '$lib/Safe.svelte'
  import SearchBar from '$lib/SearchBar.svelte'
  import { walletClient } from '$lib/stores'
</script>

<svelte:head>
  <title>Safe Safe</title>
  <meta name="description" content="Safe safe for safety." />
</svelte:head>

<SearchBar />

<div id="app-bar">
  {#if !!$walletClient}
    <Safe wallet={$walletClient}></Safe>
  {/if}
</div>

<style>
  #app-bar {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-grow: 1;
  }

  @media screen and (max-width: 540px) {
    #app-bar {
      flex-direction: column;
    }
  }
</style>
