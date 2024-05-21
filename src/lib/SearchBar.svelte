<script lang="ts">
  import { onMount } from 'svelte'
  import { appSrc, chainId, safeAddress, walletClient } from './stores'
  import { isAddress, type Address, type WalletClient } from 'viem'
  import Popup from './Popup.svelte'
  import ShortAddress from './ShortAddress.svelte'

  let hotSrc = 'https://smold.app/'
  let hotSafeAddress = ''
  let mounted = false
  let canStoreAccount = false
  let showingAccounts = false
  let showingBookmarks = false
  let editingAccount = false
  let accountNickname = ''
  let storedAccounts: { chainId: number; address: Address; nickname?: string }[] = []
  let storedAccount: (typeof storedAccounts)[0] | undefined
  let bookmarks: string[] = []

  $: parseAddressInfo(hotSafeAddress, $chainId, storedAccounts)
  $: accountsOnCurrentChain = storedAccounts.filter((x) => x.chainId === $chainId)

  const parseAddressInfo = (
    addressInput: string,
    chainId: number | undefined,
    accounts: typeof storedAccounts
  ) => {
    addressInput = addressInput.toLowerCase()
    canStoreAccount = false
    let address: Address | undefined
    if (
      storedAccount &&
      chainId == storedAccount.chainId &&
      storedAccount.nickname === addressInput
    ) {
      address = storedAccount.address
    } else if (!addressInput.match(/^[0-9]+\:/)) {
      if (addressInput !== '0' && !addressInput.startsWith('0x')) {
        addressInput = ''
      }
      hotSafeAddress = `${chainId}:${addressInput}`
      return
    }
    if (chainId) {
      if (!address) {
        const [parsedChainId, parsedAddress] = addressInput.split(':')
        if (parseInt(parsedChainId) !== chainId) {
          hotSafeAddress = `${chainId}:${parsedAddress ?? ''}`
        }
        if (isAddress(parsedAddress)) {
          address = parsedAddress
        }
      }
      if (address) {
        $safeAddress = address
        canStoreAccount = true
        storedAccount = accounts.filter(
          (x) => x.address === $safeAddress && x.chainId === chainId
        )[0]
        if (storedAccount && storedAccount.nickname) {
          hotSafeAddress = storedAccount.nickname
        }
      }
    }
  }

  const go = async () => {
    appSrc.set(hotSrc)
  }

  const showAccounts = () => {
    closeAllModals()
    showingAccounts = true
  }

  const showAccountEditor = () => {
    closeAllModals()
    editingAccount = true
    accountNickname = storedAccount?.nickname ?? ''
  }

  const showBookmarks = () => {
    closeAllModals()
    showingBookmarks = true
  }

  const closeAllModals = () => {
    showingAccounts = false
    editingAccount = false
    showingBookmarks = false
    accountNickname = ''
  }

  const saveAccountInfo = () => {
    if ($chainId && $safeAddress) {
      let edited = false
      for (const account of storedAccounts) {
        if (
          account.address.toLowerCase() === $safeAddress?.toLowerCase() &&
          account.chainId === $chainId
        ) {
          account.nickname = accountNickname || undefined
          edited = true
          break
        }
      }
      if (!edited) {
        const newAccount = {
          address: $safeAddress,
          chainId: $chainId,
          nickname: accountNickname || undefined
        }
        storedAccounts = [...storedAccounts, newAccount]
      }
      localStorage.setItem('accounts', JSON.stringify(storedAccounts))
      hotSafeAddress = `${$chainId}:${$safeAddress}`
    }
    closeAllModals()
  }

  const deleteStoredAccount = (account: (typeof storedAccounts)[0]) => {
    storedAccounts = storedAccounts.filter(
      (x) =>
        !(x.address.toLowerCase() === account.address.toLowerCase() && x.chainId == account.chainId)
    )
    localStorage.setItem('accounts', JSON.stringify(storedAccounts))
  }

  const addBookmark = () => {
    if ($appSrc) {
      bookmarks = [...bookmarks, $appSrc]
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
  }

  const deleteBookmark = (bookmark: string) => {
    bookmarks = bookmarks.filter((x) => x !== bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }

  onMount(() => {
    const searchParams = new URLSearchParams(location.search)
    hotSrc =
      decodeURIComponent(searchParams.get('app') ?? '') ||
      localStorage.getItem('lastVisited') ||
      hotSrc
    $appSrc = hotSrc

    const accountsStr = localStorage.getItem('accounts')
    if (accountsStr) {
      try {
        const accounts = JSON.parse(accountsStr)
        if (Array.isArray(accounts)) {
          storedAccounts = accounts
        }
      } catch (err) {
        localStorage.removeItem('accounts')
      }
    }

    const bookmarksStr = localStorage.getItem('bookmarks')
    if (bookmarksStr) {
      try {
        const bookmarksArray = JSON.parse(bookmarksStr)
        if (Array.isArray(bookmarksArray)) {
          bookmarks = bookmarksArray
        }
      } catch (err) {
        localStorage.removeItem('bookmarks')
      }
    }

    mounted = true
  })
</script>

<svelte:window
  on:click={() => {
    closeAllModals()
  }}
  on:keydown={(e) => {
    if (e.key === 'Escape') {
      closeAllModals()
    }
  }}
/>

<nav>
  <div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="input-wrapper" on:click|stopPropagation on:keydown|stopPropagation>
      <input
        id="safe-input"
        autocomplete="off"
        type="text"
        bind:value={hotSafeAddress}
        placeholder="Safe Address: (0x...)"
        on:focus={showAccounts}
      />
      {#if canStoreAccount}
        {#if storedAccount}
          <button on:click={showAccountEditor}>
            <i class="icofont-duotone icofont-pencil"></i>
          </button>
        {:else}
          <button on:click={showAccountEditor}>
            <i class="icofont-save"></i>
          </button>
        {/if}
        {#if editingAccount}
          <Popup
            --popup-position="absolute"
            --popup-top="110%"
            --popup-left="0"
            --popup-width="100%"
            --popup-height="fit-content"
            --popup-max-height="300px"
            showCloseButton={true}
            on:requestClose={() => {
              editingAccount = false
              accountNickname = ''
            }}
          >
            <div id="edit-account-container">
              <strong>Edit Account</strong>
              <input
                type="text"
                placeholder={storedAccount
                  ? `${storedAccount.chainId}:${storedAccount.address}`
                  : `Account Nickname`}
                bind:value={accountNickname}
                maxlength="128"
                on:keypress={(e) => (e.key === 'Enter' ? saveAccountInfo() : null)}
              />
              <button on:click={saveAccountInfo}><i class="icofont-save"></i> Save</button>
            </div>
          </Popup>
        {/if}
      {/if}
      {#if showingAccounts && accountsOnCurrentChain.length > 0}
        <Popup
          --popup-position="absolute"
          --popup-top="110%"
          --popup-left="0"
          --popup-width="100%"
          --popup-height="fit-content"
          --popup-max-height="300px"
          --popup-padding="0.5rem"
          showCloseButton={false}
        >
          <div id="accounts">
            {#each accountsOnCurrentChain as account}
              <div class="account">
                <button on:click={() => (hotSafeAddress = `${account.chainId}:${account.address}`)}>
                  {#if account.nickname}
                    {account.chainId}:{account.nickname}
                  {:else}
                    {account.chainId}:<ShortAddress address={account.address} />
                  {/if}
                </button>
                <button on:click={() => deleteStoredAccount(account)}>
                  <i class="icofont-duotone icofont-purge"></i>
                </button>
              </div>
            {/each}
          </div>
        </Popup>
      {/if}
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="input-wrapper" on:click|stopPropagation on:keydown|stopPropagation>
      <input
        id="src-input"
        type="text"
        bind:value={hotSrc}
        on:keypress={(e) => (e.key === 'Enter' ? go() : null)}
        placeholder="App URL"
        on:focus={showBookmarks}
      />
      {#if hotSrc === $appSrc}
        <button on:click={addBookmark} disabled={bookmarks.includes(hotSrc)}>
          <i class="icofont-duotone icofont-bookmark"></i>
        </button>
      {/if}
      {#if showingBookmarks && bookmarks.length > 0}
        <Popup
          --popup-position="absolute"
          --popup-top="110%"
          --popup-left="0"
          --popup-width="100%"
          --popup-height="fit-content"
          --popup-max-height="300px"
          --popup-padding="0.5rem"
          showCloseButton={false}
        >
          <div id="bookmarks">
            {#each bookmarks as bookmark}
              <div class="bookmark">
                <button on:click={() => (hotSrc = bookmark)} title={bookmark}>
                  {bookmark}
                </button>
                <button on:click={() => deleteBookmark(bookmark)}>
                  <i class="icofont-duotone icofont-purge"></i>
                </button>
              </div>
            {/each}
          </div>
        </Popup>
      {/if}
    </div>
    <button on:click={go}>Go <strong>&gt;</strong></button>
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

  .input-wrapper {
    position: relative;
    height: 32px;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  #edit-account-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  #safe-input {
    width: 400px;
    max-width: 75vw;
    font-family: monospace;
  }

  #src-input {
    width: 300px;
    max-width: 75vw;
  }

  #accounts,
  #bookmarks {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }

  .account > button,
  .bookmark > button {
    text-align: left;
  }

  .account,
  .bookmark {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  .account > button:first-child,
  .bookmark > button:first-child {
    flex-grow: 1;
  }

  .bookmark > button:first-child {
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .account > button:last-child,
  .bookmark > button:last-child {
    color: crimson;
  }
</style>
