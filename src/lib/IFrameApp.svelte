<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { IFrameCommunicator } from './iframeCommunicator'
  import type { MethodToResponse, RPCPayload } from './iframeCommunicatorTypes'
  import { Methods } from './iframeCommunicatorTypes'
  import { getAddress, type Address, type WalletClient } from 'viem'

  export let src: string
  export let wallet: WalletClient
  export let safeAddress: Address
  export let sendTx: (tx: {
    to: Address
    data?: `0x${string}`
    value?: string
  }) => Promise<`0x${string}` | null>

  let iframe: HTMLIFrameElement | undefined
  let communicator: IFrameCommunicator | undefined

  onMount(() => {
    if (!iframe) throw new Error('Missing iframe...')
    communicator = new IFrameCommunicator(iframe)
    communicator.on(Methods.getSafeInfo, async () => ({
      safeAddress,
      chainId: await wallet.getChainId(),
      owners: [],
      threshold: 1,
      isReadOnly: false
    }))

    communicator.on(Methods.getEnvironmentInfo, async () => ({
      origin: document.location.origin
    }))

    communicator.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload
      try {
        const response = (await wallet.request({
          method: params.call as any,
          params: params.params as any
        })) as MethodToResponse['rpcCall']
        return response
      } catch (err) {
        return err
      }
    })

    communicator.on(Methods.sendTransactions, async (msg) => {
      console.log(msg)
      const transactions = ((msg.data.params as any).txs as any[]).map(({ to, ...rest }) => ({
        to: getAddress(to), // checksummed
        ...rest
      }))
      const txHash = await sendTx(transactions[0])
      if (txHash) {
        communicator?.send(
          { safeTxHash: txHash } satisfies MethodToResponse[Methods.sendTransactions],
          msg.data.id
        )
      } else {
        communicator?.send('Error: TX not Completed', msg.data.id, true)
      }
    })

    communicator.on(Methods.signMessage, async () => {
      console.log('sign not supported')
    })

    communicator.on(Methods.signTypedMessage, async () => {
      console.log('sign not supported')
    })
  })

  onDestroy(() => {
    communicator?.clear()
  })
</script>

<iframe bind:this={iframe} title="IFrame App {src}" {src} frameborder="0">
  Your browser does not support IFrames...
</iframe>

<style>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>
