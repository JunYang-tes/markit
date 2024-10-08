<script lang="ts">
  import { getStatistic,getMarkedCountsByDateRange } from "../../background/db/markers";
  import type { MarkedItem } from "../../share/types";
  import Chart from '../../components/Chart.svelte';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
    import { startOfDay, subDays, endOfDay, formatDate } from "date-fns";
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  let statistics=$state( { total: 0, today: 0, mostFrequent: undefined as undefined|MarkedItem, unmarked: 0, marked: 0,
    lastSevenDaysMarked:[] as { day: Date; count: number }[]
   });
   let dataRange = $state([
    startOfDay(subDays(new Date(), 13)), endOfDay(new Date())   
   ] as [Date,Date])
   $effect(()=>{
   getMarkedCountsByDateRange(dataRange[0],dataRange[1])
   .then(data=>{
    statistics.lastSevenDaysMarked=data
   })
   });


  async function fetchStatistics() {
    const stats = await getStatistic();
    statistics = { ...stats, mostFrequent: stats.mostFrequent as MarkedItem | undefined,
     lastSevenDaysMarked: []
     };
  }

  fetchStatistics();
</script>

{#snippet card(title:string,content:string|number)}
  <div class="card statistic-card">
    <div class="card-content ">
      <div class="title">{content}</div>
      <div class="subtitle">{title}</div>
    </div>
  </div>
{/snippet}

<section>
  <h3 class="title is-4">统计</h3>
  <div class="columns">
    {@render card("总单词数", statistics.total)}
    {@render card("已标记数", statistics.marked)}
    {@render card("已取消", statistics.unmarked)}
  </div>
  <div class="columns">
    {@render card("今日新增", statistics.today)}
    {@render card("最多次", statistics.mostFrequent?.content??'')}
  </div>

  <div class="chart-container">
    <Chart
      type="bar"
      data={{
        labels: statistics.lastSevenDaysMarked.map(i => formatDate(i.day,'yyyy-MM-dd')),
        datasets: [
          {
            label: '新增单词数',
            data: statistics.lastSevenDaysMarked.map(day => day.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }}
    />
  </div>
</section>

<style>
.columns {
  gap: 10px;
}
.statistic-card {
  .card-content {
    text-align: center;
  }
  margin-bottom: var(--bulma-block-spacing);
}
</style>
