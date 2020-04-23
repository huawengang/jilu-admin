<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.stockId" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品ID" />
      <el-input v-model="listQuery.stockSn" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品编号" />
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品名称" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleInStock">入库</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" fit highlight-current-row>

      <el-table-column align="center" label="入库ID" prop="id" />

      <el-table-column align="center" label="入库编号" prop="stockSn" />

      <el-table-column align="center" label="入库时间" prop="stockTime" />

      <el-table-column align="center" label="入库商品">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showStockGoods(scope.row)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在仓库" prop="warehouseId" />

      <el-table-column align="center" label="操作时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <el-dialog title="入库" v-if='inStockVisible' :visible.sync="inStockVisible">
      <in-stock @inStockOk="closeInStock"></in-stock>
    </el-dialog>

    <el-dialog title="入库商品" v-if='stockGoodsVisible' :visible.sync="stockGoodsVisible">
      <stock-goods :stock-id="stockId"></stock-goods>
    </el-dialog>

  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
  .stock-detail-box img {
    width: 100%;
  }
</style>

<script>
import { listStock, deleteStock } from '@/api/stock'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import stockGoods from './comps/stockGoods'
import inStock from './comps/inStock'

export default {
  name: 'StockList',
  components: { BackToTop, Pagination, stockGoods, inStock },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        stockSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      stockId: 0,
      inStockVisible: false,
      stockGoodsVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listStock(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleInStock() {
      this.inStockVisible = true
    },
    handleUpdate(row) {
      this.$router.push({ path: '/stock/edit', query: { id: row.id }})
    },
    showStockGoods(row) {
      this.stockGoodsVisible = true
      this.stockId = row.id
    },
    handleDelete(row) {
      this.$confirm('确定要删除该吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStock(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    closeInStock() {
      this.inStockVisible = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
        const filterVal = ['id', 'stockSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'stockUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
