<script>
  import ConnectButton from './ConnectButton.svelte'
</script>

<nav>
  <div>
    <span>
      <span id="logo">Safe Safe</span>
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

    transition: all 1s ease-in-out;
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

  #logo {
    font-family: 'Major Mono Display', monospace;
  }
</style>
