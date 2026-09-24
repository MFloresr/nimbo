<!-- Previsión de 7 días: la barra muestra el rango de temperaturas de cada día. -->
<script lang="ts">
	import { grados, type Dia } from '$lib/meteo';
	import { preferencias } from '$lib/unidad.svelte';
	import IconoTiempo from './IconoTiempo.svelte';

	let { dias }: { dias: Dia[] } = $props();

	let escala = $derived.by(() => {
		const lo = Math.min(...dias.map((d) => d.min));
		const hi = Math.max(...dias.map((d) => d.max));
		return { lo, rango: Math.max(hi - lo, 1) };
	});
</script>

<section class="card h-100" aria-labelledby="titulo-dias">
	<div class="card-body">
		<h2 id="titulo-dias" class="h6 fw-semibold text-soft mb-2">Próximos 7 días</h2>
		<ul class="list-group list-group-flush">
			{#each dias as d (d.etiqueta)}
				{@const u = preferencias.unidad}
				<li class="list-group-item px-0 dia">
					<span class="fw-semibold">{d.etiqueta}</span>
					<IconoTiempo tipo={d.icono} tam={30} />
					<span class="text-end text-soft">{grados(d.min, u)}</span>
					<div
						class="progress"
						role="img"
						aria-label="Entre {grados(d.min, u)} y {grados(d.max, u)}"
					>
						<div
							class="progress-bar"
							style:margin-left="{((d.min - escala.lo) / escala.rango) * 100}%"
							style:width="{Math.max(((d.max - d.min) / escala.rango) * 100, 4)}%"
						></div>
					</div>
					<span class="fw-semibold">{grados(d.max, u)}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.dia {
		display: grid;
		grid-template-columns: 44px 30px 40px 1fr 40px;
		align-items: center;
		gap: 12px;
		min-height: 60px;
		font-variant-numeric: tabular-nums;
	}
</style>
