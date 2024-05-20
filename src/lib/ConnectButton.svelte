<script lang="ts">
  import {
    connect,
    disconnect,
    getWalletClient,
    injected,
    http,
    createConfig,
    watchClient
  } from '@wagmi/core'
  import { userAddress, walletClient } from './stores'
  import Loading from './Loading.svelte'
  import { NETWORKS } from './networks'
  import { onDestroy, onMount } from 'svelte'

  export const WAGMI_CONFIG = createConfig({
    chains: [...Object.values(NETWORKS)] as any,
    transports: {
      ...Object.fromEntries(Object.entries(NETWORKS).map((x) => [x[0], http()]))
    }
  })

  let unwatch: (() => void) | undefined
  const connectWallet = async () => {
    await connect(WAGMI_CONFIG, { connector: injected() })
    let client = await getWalletClient(WAGMI_CONFIG)
    if (unwatch) unwatch()
    unwatch = watchClient(WAGMI_CONFIG, {
      onChange: async (newClient) => {
        if (newClient.chain != client.chain) {
          client = await getWalletClient(WAGMI_CONFIG)
          walletClient.set(client)
        }
      }
    })
    walletClient.set(client)
  }

  const disconnectWallet = () => {
    disconnect(WAGMI_CONFIG)
  }

  onMount(() => {
    connectWallet()
  })

  onDestroy(() => {
    if (unwatch) unwatch()
  })
</script>

{#if $walletClient}
  <div class="connected">
    {#if !!$userAddress}
      <span
        >{$userAddress.substring(0, 6)}...{$userAddress.substring(
          $userAddress.length - 4,
          $userAddress.length
        )}</span
      >
      {#await $walletClient.getChainId()}
        <span>chainId: ...</span>
      {:then chainId}
        <span>chainId: <strong>{chainId}</strong></span>
      {/await}
    {:else}
      <Loading height="0.5rem" />
    {/if}
  </div>
{:else}
  <button id="connect" on:click={connectWallet}>Connect Wallet</button>
{/if}

<style>
  div.connected {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-family: monospace;
  }

  button#connect {
    padding: 0.6rem 0.75rem;
    font-weight: 700;
    border-radius: 0.75rem;
  }
</style>
