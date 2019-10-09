<template>
  <el-dialog width="80%" title="选择权限(组)" :visible.sync="fvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
            <el-form-item label="权限(组)ID" prop="id">
              <el-input v-model="propertyFilter.id" clearable placeholder="权限(组)ID" />
            </el-form-item>
            <el-form-item label="权限(组)名称" prop="displayName">
              <el-input v-model="propertyFilter.displayName" clearable placeholder="权限(组)名称" />
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
import { list } from "@/api/uaaGroup";
import { deleteEmptyProperty } from "@/utils/util";
import XEUtils from "xe-utils";

export default {
  name: "GroupSelect",
  data() {
    return {
      propertyFilter: {
        displayName: "",
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

            if (this.propertyFilter.displayName) {
              if (jsonFilter.filter) {
                jsonFilter.filter += `and displayName co "${this.propertyFilter.displayName}"`;
              } else {
                jsonFilter.filter += `displayName co "${this.propertyFilter.displayName}"`;
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

      ],
      tableColumn: [
        { type: "radio", width: 50 },
        { type: "index", width: 60 },
        { field: "id", title: "权限组ID", remoteSort: true },
        { field: "displayName", title: "权限(组)名称", remoteSort: true },
        { field: "description", title: "权限(组)描述", remoteSort: true },

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
    showGroupSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideGroupSelect(e) {
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
