<script lang="ts">
  import { connect, disconnect, getWalletClient, injected, http, createConfig } from '@wagmi/core'
  import { userAddress, walletClient } from './stores'
  import Loading from './Loading.svelte'
  import { NETWORKS } from './networks'
  import { onMount } from 'svelte'

  export const WAGMI_CONFIG = createConfig({
    chains: [...Object.values(NETWORKS)] as any,
    transports: {
      ...Object.fromEntries(Object.entries(NETWORKS).map((x) => [x[0], http()]))
    }
  })

  const connectWallet = async () => {
    await connect(WAGMI_CONFIG, { connector: injected() })
    walletClient.set(await getWalletClient(WAGMI_CONFIG))
  }

  const disconnectWallet = () => {
    disconnect(WAGMI_CONFIG)
  }

  onMount(() => {
    connectWallet()
  })
</script>

{#if $walletClient}
  <div class="connected">
    {#if !!$userAddress}
      <span>{$userAddress}</span>
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
    align-items: center;
    gap: 0.5rem;
  }

  button#connect {
    padding: 0.6rem 0.75rem;
    font-weight: 700;
    border-radius: 0.75rem;
  }
</style>
