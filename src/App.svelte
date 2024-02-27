<script>
  import { Router, Link, Route } from 'svelte-routing';
  import Home from './Home.svelte';
  import Real_shop from './Real_shop.svelte';
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/Real_shop" component={Real_shop} />
</Router>
