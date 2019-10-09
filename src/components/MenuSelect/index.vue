<template>
  <el-dialog width="80%" title="选择菜单" :visible.sync="mvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="menuFilterForm" :model="propertyFilter" :inline="true" size="small">
            <el-form-item label="代码" prop="MENU_CODE.$instr">
              <el-input v-model="propertyFilter.MENU_CODE.$instr" clearable placeholder="代码" />
            </el-form-item>
            <el-form-item label="菜单名称" prop="MENU_NAME.$instr">
              <el-input v-model="propertyFilter.MENU_NAME.$instr" clearable placeholder="菜单名称" />
            </el-form-item>
            <el-form-item label="访问路径" prop="PATH.$instr">
              <el-input v-model="propertyFilter.PATH.$instr" clearable placeholder="访问路径" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchForm('menuFilterForm')"
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="resetForm('menuFilterForm')"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <vxe-grid
        ref="xGrid"
        border
        resizable
        show-overflow
        show-header-overflow
        :customs.sync="customColumns"
        highlight-hover-row
        remote-filter
        align="center"
        max-height="650px"
        row-id="MENU_ID"
        :pager-config="{pageSize: 10}"
        :toolbar="toolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :select-config="{reserve: true}"
        @cell-dblclick="dbclick"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="Ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { list } from "@/api/menu";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  name: "MenuSelect",
  data() {
    return {
      propertyFilter: {
        MENU_NAME: { $instr: "" },
        MENU_CODE: { $instr: "" },
        PATH: { $instr: "" }
      },
      mvisible: false,
      context: {},
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        props: {
          result: "data.list",
          total: "data.total"
        },
        ajax: {
          query: ({ page, sort, filters }) => {
            // 处理排序条件
            const jsonFilter = {
              ...this.propertyFilter
            };
            const sordProperty = sort.property;
            const sordOrder = sort.order;
            if (sordProperty && sordOrder) {
              jsonFilter["$orderby"] = {};
              jsonFilter["$orderby"][sordProperty] = sordOrder.toUpperCase();
            }

            // 处理筛选条件
            filters.forEach(({ column, property, values }) => {
              jsonFilter[property] = { $in: values };
            });

            deleteEmptyProperty(jsonFilter);

            return new Promise((resolve, reject) => {
              list({ jsonFilter, page })
                .then(res => {
                  if (res.data.code !== "0") {
                    this.$message.error(res.data.message);
                    reject(res.data);
                  }
                  resolve(res.data);
                })
                .catch(err => {
                  this.$message.error(err.message);
                  reject(err.data);
                });
            });
          }
        }
      },
      toolbar: {
        id: "menu_edit_2",
        buttons: [],
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      },
      customColumns: [
        { field: "MENU_ID", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "radio", width: 50 },
        { type: "index", width: 60 },
        { field: "MENU_ID", title: "菜单标识", remoteSort: true },
        { field: "MENU_CODE", title: "菜单代码", remoteSort: true },
        { field: "MENU_NAME", title: "菜单名称", remoteSort: true },
        { field: "TYPE", title: "菜单类型", remoteSort: true },
        { field: "PATH", title: "访问路径", remoteSort: true },
        { field: "COMPONENT", title: "前端组件", remoteSort: true },
        { field: "REDIRECT", title: "重定向", remoteSort: true },
        { field: "ALWAYS_SHOW", title: "总是显示", remoteSort: true },
        { field: "META", title: "元信息", remoteSort: true },
        {
          field: "DESCRIPTION",
          title: "菜单描述",
          remoteSort: true,
          showOverflow: true
        },
        { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
        { field: "CREATED_BY", title: "创建人", remoteSort: true },
        { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
        { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
      ]
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchForm(formName) {
      this.$refs.xGrid.commitProxy("query");
    },
    dbclick(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      this.$emit("okClick", row, this.context);
      this.$refs.xGrid.clearRadioRow();
    },
    cancel() {
      this.$emit("cancelClick", {});
      this.$refs.xGrid.clearRadioRow();
      this.context = {};
    },
    Ok() {
      const row = this.$refs.xGrid.getRadioRow();
      this.$emit("okClick", row, this.context);
      this.$refs.xGrid.clearRadioRow();
      this.context = {};
    },
    showFuncSelect(e) {
      this.context = e;
      this.mvisible = true;
    },
    hideFuncSelect(e) {
      this.context = {};
      this.mvisible = false;
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
