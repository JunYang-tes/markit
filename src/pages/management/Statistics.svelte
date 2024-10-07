<script lang="ts">
  import { getStatistic } from "../../background/db/markers";
  import type { MarkedItem } from "../../share/types";
  import { Chart, Bar } from 'svelte-chartjs';

  let statistics=$state( { total: 0, today: 0, mostFrequent: undefined as undefined|MarkedItem, unmarked: 0, marked: 0,
    lastSevenDaysMarked:[] as { day: number; count: number }[]
   });

  async function fetchStatistics() {
    const stats = await getStatistic();
    statistics = { ...stats, mostFrequent: stats.mostFrequent as MarkedItem | undefined };
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
    {@render card("今日新增", statistics.today)}
    {@render card("最多次", statistics.mostFrequent?.content??'')}
  </div>

  <div class="chart-container">
    <Chart type="bar" 
      data={{
        labels: statistics.lastSevenDaysMarked.map(day => `Day ${day.day}`),
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
