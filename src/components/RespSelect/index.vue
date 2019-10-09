<template>
  <el-dialog width="80%" title="选择职责" :visible.sync="fvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
            <el-form-item label="职责代码" prop="RESPONSIBILITY_KEY.$instr">
              <el-input
                v-model="propertyFilter.RESPONSIBILITY_KEY.$instr"
                clearable
                placeholder="职责代码"
              />
            </el-form-item>
            <el-form-item label="职责名称" prop="RESPONSIBILITY_NAME.$instr">
              <el-input
                v-model="propertyFilter.RESPONSIBILITY_NAME.$instr"
                clearable
                placeholder="职责名称"
              />
            </el-form-item>
            <el-form-item label="职责描述" prop="RESPONSIBILITY_DESCRIPTION.$instr">
              <el-input
                v-model="propertyFilter.RESPONSIBILITY_DESCRIPTION.$instr"
                clearable
                placeholder="职责描述"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchForm('propertyFilterForm')"
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="resetForm('propertyFilterForm')"
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
        row-id="id"
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
// import XEAjax from "xe-ajax";
import { list } from "@/api/responsibility";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  name: "RespSelect",
  data() {
    return {
      propertyFilter: {
        RESPONSIBILITY_NAME: { $instr: "" },
        RESPONSIBILITY_KEY: { $instr: "" },
        RESPONSIBILITY_DESCRIPTION: { $instr: "" }
      },
      context: {},
      fvisible: false,
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
              if (values && values.length > 0) {
                jsonFilter[property] = values[0];
              }
            });

            deleteEmptyProperty(jsonFilter);

            return new Promise((resolve, reject) => {
              list({ jsonFilter, page })
                .then(res => {
                  if (res.data.code !== "0") {
                    this.$message.error(res.data.message);
                    reject(res.data);
                    return;
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
        id: "fullresp_edit_1",
        buttons: [
        ],
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      },
      customColumns: [
        { field: "APPLICATION_ID", visible: false },
        { field: "RESPONSIBILITY_ID", visible: false },
        { field: "MENU_ID", visible: false },
        { field: "VERSION", visible: false },
        { field: "REQUEST_GROUP_ID", visible: false },
        { field: "DATA_GROUP_ID", visible: false },
        { field: "DATA_GROUP_APPLICATION_ID", visible: false },
        { field: "GROUP_APPLICATION_ID", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "radio", width: 50 },
        { type: "index", width: 60 },
        { field: "RESPONSIBILITY_ID", title: "职责ID", remoteSort: true },
        { field: "APPLICATION_ID", title: "应用标识", remoteSort: true },
        { field: "RESPONSIBILITY_KEY", title: "职责代码", remoteSort: true },
        { field: "RESPONSIBILITY_NAME", title: "职责名称", remoteSort: true },
        {
          field: "APPLICATION_SHORT_NAME",
          title: "应用简称",
          remoteSort: true
        },
        { field: "MENU_ID", title: "顶级菜单ID", remoteSort: true },
        { field: "MENU_NAME", title: "顶级菜单", remoteSort: true },
        { field: "START_DATE", title: "启用时间", remoteSort: true },
        { field: "END_DATE", title: "结束时间", remoteSort: true },
        {
          field: "RESPONSIBILITY_DESCRIPTION",
          title: "职责描述",
          remoteSort: true
        },
        { field: "VERSION", title: "版本号", remoteSort: true },
        { field: "REQUEST_GROUP_ID", title: "请求组ID", remoteSort: true },
        { field: "DATA_GROUP_ID", title: "数据组ID", remoteSort: true },
        {
          field: "DATA_GROUP_APPLICATION_ID",
          title: "数据组应用ID",
          remoteSort: true
        },
        {
          field: "GROUP_APPLICATION_ID",
          title: "请求组应用ID",
          remoteSort: true
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
    showRespSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideRespSelect(e) {
      this.context = {};
      this.fvisible = false;
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
