<script lang="ts">
  import { isAddress, parseEther, zeroAddress, type Address, type WalletClient } from 'viem'
  import { SafeABI } from './safeAbi'
  import { NETWORKS } from './networks'
  import IFrameApp from './IFrameApp.svelte'
  import { appSrc, chainId, safeAddress } from './stores'

  export let wallet: WalletClient

  let to: string
  let calldata: `0x${string}`
  let value: string

  const executeTx = async (chainId: number) => {
    if (!wallet.account || !$safeAddress) throw new Error('Missing account.')
    if (!isAddress(to)) {
      alert(`${to} is not a valid address`)
      return null
    }
    if (!isAddress($safeAddress)) {
      alert(`${$safeAddress} is not a valid address`)
      return null
    }
    const walletAddress = (await wallet.getAddresses())[0]
    const signatures: `0x${string}` = `0x000000000000000000000000${walletAddress.split('0x')[1]}000000000000000000000000000000000000000000000000000000000000000001`
    const txHash = await wallet.writeContract({
      chain: NETWORKS[chainId],
      address: $safeAddress,
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
    return txHash
  }
</script>

<div id="container">
  {#if $appSrc && $safeAddress && $chainId}
    {#key $appSrc}
      {#key $safeAddress}
        {#key $chainId}
          <IFrameApp
            src={$appSrc}
            safeAddress={$safeAddress}
            {wallet}
            sendTx={async (tx) => {
              console.log(tx)
              to = tx.to
              calldata = tx.data ?? '0x0'
              value = tx.value ?? ''
              try {
                return await executeTx($chainId)
              } catch (err) {
                return null
              }
            }}
          />
        {/key}
      {/key}
    {/key}
  {/if}
</div>

<style>
  #container {
    flex-grow: 1;
  }
</style>
