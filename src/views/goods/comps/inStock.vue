<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="right" label-width="100px">
      <el-form-item label="入库编号" prop="stockSn">
        <el-input v-model="dataForm.stockSn" />
      </el-form-item>
      <el-form-item label="入库时间" prop="stockTime">
        <el-date-picker
          v-model="dataForm.stockTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入驻仓库" prop="warehouseId">
        <el-select v-model="dataForm.warehouseId" clearable placeholder="请选择">
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库商品">
        <el-select v-model="goodsId" clearable placeholder="请选择" @change="addInStockGoods">
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-table v-if="dataForm.stockGoods.length" :data="dataForm.stockGoods" fit highlight-current-row>
        <el-table-column align="center" label="商品名" prop="goodsName" />

        <el-table-column align="center" label="入库数量" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stockNum" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="生产日期" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.expDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="removeItem(scope.row)">移除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-form>
    <div v-if="dataForm.stockGoods.length" class="ce-internal-footer">
      <el-button type="primary" @click="doInStock" class="ensure">确定</el-button>
      <el-button @click="cancelInStock">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { allGoods } from '@/api/goods'
  import { listWarehouse } from '@/api/warehouse'
  import { inStock } from '@/api/stock'
  export default {
    name: "in-stock",
    data() {
      return {
        listLoading: true,
        list: [],
        goodsList: [],
        warehouseList: [],
        goodsId: '',
        dataForm: {
          id: undefined,
          stockTime: '',
          stockSn: '',
          warehouseId: '',
          stockGoods: []
        },
        rules: {
          stockSn: [
            { required: true, message: '入库编号不能为空', trigger: 'blur' }
          ],
          stockTime: [
            { required: true, message: '入库时间不能为空', trigger: 'blur' }
          ],
          warehouseId: [
            { required: true, message: '入驻仓库不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getGoodsList()
      this.getWarehouseList()
      this.generateStockSn()
    },
    methods: {
      getGoodsList() {
        allGoods()
          .then(response => {
            this.goodsList = response.data.data
          })
      },
      getWarehouseList() {
        listWarehouse()
          .then(response => {
            this.warehouseList = response.data.data
          })
      },
      addInStockGoods(value) {
        if(this.dataForm.stockGoods.findIndex(item => item.goodsId === value) !== -1) {
          this.$notify({
            title: '警告',
            message: '该商品已经添加，不能重复添加',
            type: 'warning'
          });
          this.goodsId = ''
          return
        }
        const goods = {
          goodsId: value,
          goodsName: this.goodsList.find(item => item.id === value).name,
          stockNum: 0,
          expDate: ''
        }
        this.dataForm.stockGoods.push(goods)
        this.goodsId = ''
      },
      doInStock() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            inStock(this.dataForm)
              .then(response => {
                this.$notify.success({
                  title: '成功',
                  message: '入库成功'
                })
              })
              .catch(response => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.errmsg
                })
              })
            this.$emit('inStockOk')
          }
        })
      },
      cancelInStock() {
        this.$emit('inStockOk')
      },
      removeItem(item) {
        const index = this.dataForm.stockGoods.indexOf(item)
        this.dataForm.stockGoods.splice(index, 1)
      },
      generateStockSn() {
        // 入库编号规则：年月日小时分秒毫秒 如 20200423155459861
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        const milliSeconds = date.getMilliseconds();
        this.dataForm.stockSn = year + '' + month + '' + day + '' + hour + '' + minute + '' + second + '' + milliSeconds;

      }
    }
  }
</script>

<style scoped>

</style>
