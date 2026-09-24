<!-- Barra superior: marca, buscador de lugares, ubicación del navegador y unidades. -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { enlaceLugar } from '$lib/meteo';
	import { preferencias, cambiarUnidad } from '$lib/unidad.svelte';

	let { busqueda = '', onAviso }: { busqueda?: string; onAviso: (texto: string) => void } =
		$props();

	let texto = $derived(busqueda);
	let localizando = $state(false);
	let cargando = $derived(navigating.to !== null || localizando);

	function usarUbicacion() {
		if (!('geolocation' in navigator)) {
			onAviso('Tu navegador no permite obtener la ubicación. Busca tu ciudad por su nombre.');
			return;
		}
		localizando = true;
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				await goto(
					enlaceLugar({
						nombre: 'Tu ubicación',
						detalle: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`,
						lat: pos.coords.latitude,
						lon: pos.coords.longitude
					})
				);
				localizando = false;
			},
			() => {
				localizando = false;
				onAviso('No se ha podido obtener tu ubicación. Revisa el permiso del navegador o busca tu ciudad.');
			},
			{ timeout: 10000, maximumAge: 600000 }
		);
	}
</script>

<nav class="navbar py-3">
	<div class="container-xxl gap-3 flex-wrap">
		<a class="navbar-brand d-flex align-items-center gap-2 display fw-bold fs-3 m-0" href="/">
			<svg
				width="32"
				height="32"
				viewBox="0 0 200 200"
				fill="none"
				stroke="currentColor"
				stroke-width="14"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M58 150h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 150z" />
			</svg>
			Nimbo
		</a>

		<form
			class="buscador-form flex-grow-1 order-last order-md-0"
			role="search"
			method="GET"
			action="/"
		>
			<div class="input-group buscador">
				<span class="input-group-text">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg
					>
				</span>
				<label for="q" class="visually-hidden">Buscar ciudad</label>
				<input
					id="q"
					name="q"
					type="search"
					class="form-control"
					placeholder="Buscar ciudad…"
					autocomplete="off"
					required
					minlength="2"
					bind:value={texto}
				/>
				<button class="btn btn-nimbo px-3" type="submit" disabled={cargando}>
					{#if navigating.to && !localizando}
						<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
						<span class="visually-hidden">Buscando…</span>
					{:else}
						Buscar
					{/if}
				</button>
			</div>
		</form>

		<div class="d-flex align-items-center gap-2 ms-auto ms-md-0">
			<button
				type="button"
				class="btn btn-suave rounded-circle d-flex align-items-center justify-content-center p-0"
				aria-label="Usar mi ubicación"
				title="Usar mi ubicación"
				onclick={usarUbicacion}
				disabled={localizando}
			>
				{#if localizando}
					<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
				{:else}
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" /><circle
							cx="12"
							cy="10"
							r="2"
						/></svg
					>
				{/if}
			</button>
			<div class="btn-group unidades" role="group" aria-label="Unidad de temperatura">
				{#each ['C', 'F'] as const as u (u)}
					<button
						type="button"
						class="btn"
						class:active={preferencias.unidad === u}
						aria-pressed={preferencias.unidad === u}
						onclick={() => cambiarUnidad(u)}>°{u}</button
					>
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.buscador-form {
		max-width: 560px;
	}
	.buscador {
		background: var(--n-card);
		border: 1px solid var(--n-line);
		border-radius: 999px;
		padding: 4px 4px 4px 16px;
		align-items: center;
	}
	.buscador .input-group-text {
		background: transparent;
		border: 0;
		color: var(--n-ink);
		padding: 0 4px 0 0;
	}
	.buscador .form-control {
		background: transparent;
		border: 0;
		color: var(--n-ink);
		box-shadow: none;
		font-size: 16px;
	}
	.buscador .form-control::placeholder {
		color: var(--n-soft);
	}
	.buscador .btn {
		min-width: 88px;
		min-height: 40px;
	}
	.unidades {
		background: var(--n-card);
		border: 1px solid var(--n-line);
		border-radius: 999px;
		padding: 3px;
		gap: 3px;
	}
	.unidades .btn {
		border: 0;
		border-radius: 999px !important;
		min-width: 44px;
		min-height: 38px;
		font-weight: 600;
		--bs-btn-color: var(--n-ink);
		--bs-btn-hover-color: var(--n-ink);
		--bs-btn-active-bg: var(--n-ink);
		--bs-btn-active-color: var(--n-bg);
	}
	.unidades .btn.active {
		background: var(--n-ink);
		color: var(--n-bg);
	}
</style>
