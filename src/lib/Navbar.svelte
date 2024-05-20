<script>
  import ConnectButton from './ConnectButton.svelte'
</script>

<nav>
  <div>
    <span>
      <img src="favicon.svg" alt="" />
      <strong>Safe Safe</strong>
    </span>
    <ConnectButton />
  </div>
</nav>

<style>
  nav {
    padding: 0.5rem 1rem;
    background-color: inherit;
    border-bottom: solid 2px currentColor;
    z-index: 50;
    font-family: monospace;
  }

  nav > div {
    margin: 0 auto;
    width: 100%;
    max-width: 1280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav > div > span {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 24px;
    font-family: monospace;
  }

  nav > div img {
    height: 32px;
  }
</style>
