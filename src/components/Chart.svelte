<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    let canvasRef: HTMLCanvasElement;
    let chartInstance: Chart;
    let {
        data,
        options = {},
        type,
    } = $props<{
        type: any;
        data: any;
        options: any;
    }>();

    onMount(() => {
        if (canvasRef) {
            Chart.register(...registerables);
            chartInstance = new Chart(canvasRef, {
                type,
                data,
                options,
            });
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    });
    $effect(() => {
        let d = data;
        if (chartInstance) {
            chartInstance.data = d;
            chartInstance.update();
        }
    });
</script>

<canvas bind:this={canvasRef}></canvas>
