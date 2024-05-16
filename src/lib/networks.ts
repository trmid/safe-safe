import { arbitrum, mainnet, optimism, base, type Chain } from 'viem/chains'

export const NETWORKS: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [arbitrum.id]: arbitrum,
  [optimism.id]: optimism,
  [base.id]: base
} as const
