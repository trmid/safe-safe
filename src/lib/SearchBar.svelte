<script lang="ts">
  import { onMount } from 'svelte'
  import { appSrc, safeAddress } from './stores'
  import { isAddress, type Address } from 'viem'
  import { pushState } from '$app/navigation'
  import { page } from '$app/stores'

  let hotSrc = 'https://smold.app/'
  let hotSafeAddress = ''
  let mounted = false

  $: if (isAddress(hotSafeAddress)) setSafeAddress(hotSafeAddress)

  const setSafeAddress = (address: Address) => {
    $safeAddress = address
  }

  const go = () => {
    appSrc.set(hotSrc)
    if (mounted && location) {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set('app', encodeURIComponent(hotSrc))
      pushState(`?${searchParams.toString()}`, $page.state)
    }
  }

  onMount(() => {
    const searchParams = new URLSearchParams(location.search)
    hotSrc = decodeURIComponent(searchParams.get('app') ?? '') || hotSrc
    $appSrc = hotSrc
    mounted = true
  })
</script>

<nav>
  <div>
    <input type="text" bind:value={hotSafeAddress} placeholder="Safe Address: (0x...)" />
    <input
      type="text"
      bind:value={hotSrc}
      on:keypress={(e) => (e.key === 'Enter' ? go() : null)}
      placeholder="App URL"
    />
    <button on:click={go}>Go &gt;</button>
  </div>
</nav>

<style>
  nav {
    background-color: var(--primary);
  }

  nav > div {
    margin: 0 auto;
    max-width: 1280px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-family: monospace;
  }
</style>
