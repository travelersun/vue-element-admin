<template>
  <el-dialog width="80%" title="选择用户" :visible.sync="fvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="propertyFilter.userName" clearable placeholder="用户名" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="propertyFilter.email" clearable placeholder="邮箱" />
            </el-form-item>
            <el-form-item label="用户ID" prop="id">
              <el-input v-model="propertyFilter.id" clearable placeholder="用户ID" />
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
import { list } from "@/api/uaaUser";
import { deleteEmptyProperty } from "@/utils/util";
import XEUtils from "xe-utils";

export default {
  name: "UserSelect",
  data() {
    return {
      propertyFilter: {
        userName: "",
        email: "",
        id: ""
      },
      context: {},
      fvisible: false,
      tableProxy: {
        index: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        props: {
          result: "resources",
          total: "totalResults"
        },
        ajax: {
          query: ({ page, sort, filters }) => {
            const { currentPage, pageSize } = page;
            // 处理排序条件
            const jsonFilter = {
              filter: "",
              sortBy: "",
              sortOrder: "",
              startIndex: "",
              count: ""
            };

            if (this.propertyFilter.userName) {
              if (jsonFilter.filter) {
                jsonFilter.filter += `and userName co "${this.propertyFilter.userName}"`;
              } else {
                jsonFilter.filter += `userName co "${this.propertyFilter.userName}"`;
              }
            }

            if (this.propertyFilter.email) {
              if (jsonFilter.filter) {
                jsonFilter.filter += `and email co "${this.propertyFilter.email}"`;
              } else {
                jsonFilter.filter += `email co "${this.propertyFilter.email}"`;
              }
            }

            if (this.propertyFilter.id) {
              if (jsonFilter.filter) {
                jsonFilter.filter += `and id sw "${this.propertyFilter.id}"`;
              } else {
                jsonFilter.filter += `id sw "${this.propertyFilter.id}"`;
              }
            }

            const sordProperty = sort.property;
            const sordOrder = sort.order;
            if (sordProperty && sordOrder) {
              jsonFilter.sortBy = sordProperty;
              jsonFilter.sortOrder =
                sordOrder.toUpperCase() === "ASC" ? "ascending" : "descending";
            }

            jsonFilter.startIndex = (currentPage - 1) * pageSize + 1;
            jsonFilter.count = pageSize;

            deleteEmptyProperty(jsonFilter);

            return new Promise((resolve, reject) => {
              list(jsonFilter)
                .then(res => {
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
        id: "full_edit_1",
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
        { field: "id", visible: false },
        { field: "externalId", visible: false },
        { field: "meta.lastModified", visible: false },
        { field: "passwordLastModified", visible: false },
        { field: "previousLogonTime", visible: false },
        { field: "lastLogonTime", visible: false },
        { field: "verified", visible: false }
      ],
      tableColumn: [
        { type: "radio", width: 50 },
        { type: "index", width: 60 },
        { field: "id", title: "用户标识", remoteSort: true },
        { field: "externalId", title: "用户外部标识" },
        { field: "userName", title: "用户名", remoteSort: true },
        {
          field: "name",
          title: "姓名",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue.familyName && cellValue.givenName) {
              return cellValue.familyName + " " + cellValue.givenName;
            } else if (cellValue.familyName || cellValue.givenName) {
              return cellValue.familyName + cellValue.givenName;
            }
          }
        },
        {
          field: "emails",
          title: "email",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue && cellValue.length > 0) {
              return cellValue[0].value;
            }
          }
        },
        {
          field: "phoneNumbers",
          title: "电话",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue && cellValue.length > 0) {
              return cellValue[0].value;
            }
          }
        },
        { field: "active", title: "活跃状态", remoteSort: true },
        { field: "verified", title: "验证状态", remoteSort: true },
        {
          field: "meta.created",
          title: "创建时间",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue) {
              return XEUtils.toDateString(
                new Date(cellValue),
                "yyyy-MM-dd HH:ss:mm"
              );
            }
          }
        },
        {
          field: "meta.lastModified",
          title: "最后修改时间",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue) {
              return XEUtils.toDateString(
                new Date(cellValue),
                "yyyy-MM-dd HH:ss:mm"
              );
            }
          }
        },
        {
          field: "passwordLastModified",
          title: "最后密码修改时间",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue) {
              return XEUtils.toDateString(
                new Date(cellValue),
                "yyyy-MM-dd HH:ss:mm"
              );
            }
          }
        },
        {
          field: "previousLogonTime",
          title: "上次登陆时间",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue) {
              return XEUtils.toDateString(
                new Date(cellValue),
                "yyyy-MM-dd HH:ss:mm"
              );
            }
          }
        },
        {
          field: "lastLogonTime",
          title: "最近登陆时间",
          formatter: function({
            cellValue,
            row,
            rowIndex,
            column,
            columnIndex
          }) {
            if (cellValue) {
              return XEUtils.toDateString(
                new Date(cellValue),
                "yyyy-MM-dd HH:ss:mm"
              );
            }
          }
        }
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
    showUserSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideUserSelect(e) {
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
