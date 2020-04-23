<template>
  <div class="app-container">
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" fit highlight-current-row>

      <el-table-column align="center" label="入库ID" prop="stockId" />

      <el-table-column align="center" label="入库编号" prop="stockSn" />

      <el-table-column align="center" label="入库商品" prop="goodsName" />

      <el-table-column align="center" label="生产日期" prop="expDate" />

      <el-table-column align="center" label="入库数量" prop="stockNum" />

    </el-table>
  </div>
</template>

<script>
  import { listGoodsByStock } from '@/api/stock'
  export default {
    name: "stock-goods",
    props: {
      stockId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        listLoading: true,
        list: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        listGoodsByStock(this.stockId).then(response => {
          this.list = response.data.data
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
