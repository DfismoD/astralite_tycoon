<script>
  import { Router, Link, Route } from 'svelte-routing';
  import Home from './Home.svelte';
  import Shop from './Shop.svelte';
  import Bagpack from './Bagpack.svelte';
  import Real_shop from './Real_shop.svelte';
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/Shop" component={Shop} />
  <Route path="/Bagpack" component={Bagpack} />
  <Route path="/Real_shop" component={Real_shop} />
</Router>
