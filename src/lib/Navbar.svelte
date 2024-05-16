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
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: inherit;
    border-bottom: solid 2px var(--pt-purple-700);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    z-index: 50;
    font-family: monospace;
  }

  nav > div {
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
