<script lang="ts">
  export let address: string
  export let enableCopy = false

  let copied = false

  const copy = () => {
    if (enableCopy && navigator && navigator.clipboard) {
      navigator.clipboard.writeText(address)
      copied = true
      setTimeout(() => (copied = false), 1000)
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span id="address" title={address} on:click={copy}>
  {#if copied}
    copied!
  {:else}
    {address.substring(0, 6)}...{address.substring(address.length - 4)}
  {/if}
</span>

<style>
  #address {
    font-family: monospace;
  }
</style>
