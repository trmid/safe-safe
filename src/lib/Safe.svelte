<script lang="ts">
  import { isAddress, parseEther, zeroAddress, type Address, type WalletClient } from 'viem'
  import { SafeABI } from './safeAbi'
  import { NETWORKS } from './networks'

  export let wallet: WalletClient

  let safeAddress: string
  let to: string
  let calldata: `0x${string}`
  let value: string

  const execute = async (chainId: number) => {
    if (!wallet.account) throw new Error('Missing account.')
    if (!isAddress(to)) {
      return alert(`${to} is not a valid address`)
    }
    if (!isAddress(safeAddress)) {
      return alert(`${safeAddress} is not a valid address`)
    }
    const walletAddress = (await wallet.getAddresses())[0]
    const signatures: `0x${string}` = `0x000000000000000000000000${walletAddress.split('0x')[1]}000000000000000000000000000000000000000000000000000000000000000001`
    await wallet.writeContract({
      chain: NETWORKS[chainId],
      address: safeAddress,
      account: wallet.account,
      abi: SafeABI,
      functionName: 'execTransaction',
      args: [
        to,
        parseEther(value || '0'),
        calldata,
        0,
        0n,
        0n,
        0n,
        zeroAddress,
        zeroAddress,
        signatures
      ]
    })
  }
</script>

<div id="container">
  {#await wallet.getChainId()}
    <span>Connecting...</span>
  {:then chainId}
    <div>
      <h2>Safe</h2>
      <code>Chain ID: {chainId}</code>
      <br /><br />
    </div>
    <div id="tx-form">
      <input type="text" placeholder="Safe: 0x123...abc" bind:value={safeAddress} />
      <input type="text" placeholder="To: 0x123...abc" bind:value={to} />
      <textarea
        name="calldata"
        id="calldata"
        placeholder="Calldata: 0x012345689abcdef..."
        rows="10"
        cols="50"
        bind:value={calldata}
      ></textarea>
      <input type="text" placeholder="Value: (0.0 eth)" bind:value />
      <button on:click={() => execute(chainId)}>Execute</button>
    </div>
  {/await}
</div>

<style>
  #tx-form {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
    width: 1024px;
    max-width: 90vw;
  }
</style>
