<script>
  import Navbar from '$lib/Navbar.svelte'
  import '../app.css'
</script>

<Navbar />

<main><slot /></main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    background-color: var(--secondary);
    background: linear-gradient(170deg, var(--primary) -10%, var(--secondary) 110%);
  }
</style>
