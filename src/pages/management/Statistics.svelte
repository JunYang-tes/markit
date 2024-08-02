<script lang="ts">
  import { getAll } from "../../background/db/markers";

  let words = getAll("date");
  let total = $state(0);
  words.then((words) => {
    total = words.length;
  });
</script>

<div>Statistics</div>
<div>
  总单词数:{total}
</div>
