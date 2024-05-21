import { writable } from 'svelte/store'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)
export const safeAddress = writable<Address | undefined>(undefined)
export const appSrc = writable<string | undefined>(undefined)
export const chainId = writable<number | undefined>(undefined)
export const activePopupCount = writable<number>(0)

walletClient.subscribe(async (client) => {
  if (!!client) {
    const address = (await client.getAddresses())[0]
    userAddress.set(address)
    chainId.set(await client.getChainId())
  }
})

appSrc.subscribe(async (src) => {
  if (src) {
    // Last visited:
    localStorage.setItem('lastVisited', src)

    // Colors:
    try {
      const url = new URL(src)
      url.pathname = '/manifest.json'
      const res = await fetch(url)
      if (res.status === 200) {
        const manifest = await res.json()

        let primary = manifest.title_color?.toLowerCase()
        let bg = manifest.background_color?.toLowerCase()
        let bg2 = manifest.background_color?.toLowerCase()
        let secondary = manifest.theme_color?.toLowerCase()
        if (bg.startsWith('#')) {
          if (bg.length === 4) {
            bg = `#${bg.charAt(1)}${bg.charAt(1)}${bg.charAt(2)}${bg.charAt(2)}${bg.charAt(3)}${bg.charAt(3)}`
            bg2 = bg
          }
          const r = parseInt(`0x${bg2.substring(1, 3)}`)
          const g = parseInt(`0x${bg2.substring(3, 5)}`)
          const b = parseInt(`0x${bg2.substring(5, 7)}`)
          bg2 =
            '#' +
            Math.min(255, Math.max(0, r > 128 ? r - 10 : r + 10)).toString(16) +
            Math.min(255, Math.max(0, g > 128 ? g - 10 : g + 10)).toString(16) +
            Math.min(255, Math.max(0, b > 128 ? b - 10 : b + 10)).toString(16)
          if (!primary) {
            if ((r + g + b) / 3 > 128) primary = '#000000'
            else primary = '#ffffff'
          }
        }
        if (primary && bg && secondary && primary !== bg) {
          // use the colors
        } else {
          bg = '#231f20'
          bg2 = '#17171a'
          primary = '#ffcad9'
          secondary = '#284051'
        }
        document.documentElement.style.setProperty('--primary', primary)
        document.documentElement.style.setProperty('--secondary', secondary)
        document.documentElement.style.setProperty('--bg', bg)
        document.documentElement.style.setProperty('--bg-2', bg2)
      }
    } catch (err) {
      console.error(new Error('Failed to fetch app manifest.'))
      console.error(err)
      document.documentElement.style.removeProperty('--primary')
      document.documentElement.style.removeProperty('--secondary')
      document.documentElement.style.removeProperty('--bg')
      document.documentElement.style.removeProperty('--bg-2')
    }
  }
})
