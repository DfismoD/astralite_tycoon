<script>
// @ts-nocheck

  import { Router, Link, Route } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Home from './Home.svelte';
</script>


<Router>
  <Route path="/" component={Home} />
  <!-- svelte-ignore missing-declaration -->
</Router>
