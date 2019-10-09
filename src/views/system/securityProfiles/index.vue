<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="应用简称" prop="APPLICATION_SHORT_NAME.$instr">
            <el-input v-model="propertyFilter.APPLICATION_SHORT_NAME.$instr" clearable placeholder="应用简称" />
          </el-form-item>
          <el-form-item label="基础路径" prop="BASEPATH.$instr">
            <el-input v-model="propertyFilter.BASEPATH.$instr" clearable placeholder="基础路径" />
          </el-form-item>
          <el-form-item label="产品代码" prop="PRODUCT_CODE.$instr">
            <el-input v-model="propertyFilter.PRODUCT_CODE.$instr" clearable placeholder="产品代码" />
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="addNewForm()">新增</el-button>
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
      row-id="APPLICATION_ID"
      :pager-config="{pageSize: 10}"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      @cell-dblclick="dbclick"
    />
    <el-dialog
      :visible.sync="editDialog.visible"
      :before-close="closeEditDialog"
      :title="editDialog.title"
      width="40%"
    >
      <el-form ref="editForm" label-width="30%" :model="editDialog.formData">
        <el-form-item label="应用标识" prop="APPLICATION_ID">
          <el-input
            v-model="editDialog.formData.APPLICATION_ID"
            clearable
            placeholder="应用标识"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item label="应用简称" prop="APPLICATION_SHORT_NAME" :rules="[{required:true, message:'应用简称', trigger:'blur'}]">
          <el-input
            v-model="editDialog.formData.APPLICATION_SHORT_NAME"
            clearable
            placeholder="应用简称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="基础路径"
          prop="BASEPATH"
          :rules="[{required:true, message:'基础路径', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.BASEPATH"
            clearable
            placeholder="基础路径"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="产品代码"
          prop="PRODUCT_CODE"
          :rules="[{required:true,message:'产品代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.PRODUCT_CODE"
            clearable
            placeholder="产品代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="应用描述" prop="APPLICATION_DESCRIPTION">
          <el-input
            v-model="editDialog.formData.APPLICATION_DESCRIPTION"
            type="textarea"
            clearable
            placeholder="应用描述"
            style="width: 90%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import XEAjax from "xe-ajax";
import { list, save, del } from "@/api/application";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  data() {
    return {
      propertyFilter: {
        APPLICATION_SHORT_NAME: { $instr: "" },
        BASEPATH: { $instr: "" },
        PRODUCT_CODE: { $instr: "" }
      },
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
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
                    return;
                  }
                  resolve(res.data);
                })
                .catch(err => {
                  this.$message.error(err.message);
                  reject(err.data);
                });
            });
          },
          delete: ({ body }) => {
            return new Promise((resolve, reject) => {
              del(body)
                .then(res => {
                  if (res.data.code !== "0") {
                    this.$message.error(res.data.message);
                    resolve();
                    return;
                  }
                  this.$message.success(res.data.message);
                  resolve();
                })
                .catch(err => {
                  this.$message.error(err.data);
                  reject();
                });
            });
          }
        }
      },
      toolbar: {
        id: "full_edit_1",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" }
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
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "APPLICATION_ID", title: "应用标识", remoteSort: true },
        { field: "APPLICATION_SHORT_NAME", title: "应用简称", remoteSort: true },
        { field: "APPLICATION_DESCRIPTION", title: "应用描述", remoteSort: true },
        { field: "BASEPATH", title: "基础路径", remoteSort: true },
        { field: "PRODUCT_CODE", title: "产品代码", remoteSort: true },
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
    addNewForm() {
      this.editDialog.formData = {};
      this.editDialog.visible = true;
    },
    closeEditDialog() {
      this.$refs.editForm.clearValidate();
      this.editDialog.visible = false;
      this.$refs.editForm.resetFields();
      this.$refs.xGrid.commitProxy("query");
    },
    dbclick(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      this.editDialog.formData = row;
      this.editDialog.visible = true;
    },
    saveForm() {
      const theThis = this;
      this.$refs.editForm.validate(function(valid) {
        if (!valid) {
          return;
        }
        save(theThis.editDialog.formData)
          .then(res => {
            if (res.data.code !== "0") {
              theThis.$message.error(res.data.message);
              return;
            }
            theThis.$message.success(res.data.message);
            theThis.editDialog.formData = {};
            theThis.closeEditDialog();
          })
          .catch(err => {
            theThis.$message.error(err.message);
          });
      });
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
