import { writable } from 'svelte/store'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)
export const safeAddress = writable<Address | undefined>(undefined)
export const appSrc = writable<string | undefined>(undefined)
export const showBookmarks = writable<boolean>(false)
export const chainId = writable<number | undefined>(undefined)

walletClient.subscribe(async (client) => {
  if (!!client) {
    const address = (await client.getAddresses())[0]
    userAddress.set(address)
    chainId.set(await client.getChainId())
  }
})
