<!-- Previsión de las próximas 8 horas con probabilidad de lluvia. -->
<script lang="ts">
	import { grados, type Hora } from '$lib/meteo';
	import { preferencias } from '$lib/unidad.svelte';
	import IconoTiempo from './IconoTiempo.svelte';

	let { horas }: { horas: Hora[] } = $props();
</script>

<section class="card" aria-labelledby="titulo-horas">
	<div class="card-body">
		<h2 id="titulo-horas" class="h6 fw-semibold text-soft mb-3">Próximas horas</h2>
		<ol class="horas list-unstyled m-0">
			{#each horas as h (h.etiqueta)}
				<li class="hora">
					<span class="small fw-medium text-soft">{h.etiqueta}</span>
					<IconoTiempo tipo={h.icono} tam={34} />
					<span class="display fw-bold fs-5">{grados(h.temp, preferencias.unidad)}</span>
					<span
						class="small text-soft d-flex align-items-center gap-1"
						title="Probabilidad de lluvia"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.4"
							aria-hidden="true"
							><path d="M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z" /></svg
						>
						<span class="visually-hidden">Probabilidad de lluvia:</span>
						{h.probLluvia}%
					</span>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.horas {
		/* Contiene los textos .visually-hidden (absolutos) dentro del scroll horizontal */
		position: relative;
		display: grid;
		grid-template-columns: repeat(8, minmax(64px, 1fr));
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
	}
	.hora {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px 0;
		font-variant-numeric: tabular-nums;
	}
</style>
