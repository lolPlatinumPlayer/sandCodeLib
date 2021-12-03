<template>
    <div class="board">
      <div class="row"
           v-for="row in view"
      >
        <div class="cell"
             v-for="cell in row"
        >
          {{cell.val}}
        </div>
      </div>
    </div>
</template>

<script>

export default {
    name: "board",
    data() {
        return {
          view:[
            [{val:1},{val:2},{val:3},{val:4},],
            [{val:1},{val:2},{val:3},{val:4},],
            [{val:1},{val:2},{val:3},{val:4},],
            [{val:1},{val:2},{val:3},{val:4},],
          ]
        }
    },
    mounted() {
    },
    methods: {},
}
</script>

<style lang="less">
  .board{
    .row{
      display: flex;
      .cell{
        flex-grow: 1;
        text-align: center;
      }
    }
  }
</style>
