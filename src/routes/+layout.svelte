<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '@fontsource-variable/bricolage-grotesque';
	import '@fontsource-variable/dm-sans';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
