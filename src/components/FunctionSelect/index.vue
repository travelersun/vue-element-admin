<template>
  <el-dialog width="80%" title="选择功能" :visible.sync="fvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="funcSearchForm" :model="propertyFilter" :inline="true" size="small">
            <el-form-item label="代码" prop="FUNCTION_CODE.$instr">
              <el-input v-model="propertyFilter.FUNCTION_CODE.$instr" clearable placeholder="代码" />
            </el-form-item>
            <el-form-item label="功能名称" prop="FUNCTION_NAME.$instr">
              <el-input v-model="propertyFilter.FUNCTION_NAME.$instr" clearable placeholder="功能名称" />
            </el-form-item>
            <el-form-item label="访问路径" prop="PATH.$instr">
              <el-input v-model="propertyFilter.PATH.$instr" clearable placeholder="访问路径" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchForm('funcSearchForm')"
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="resetForm('funcSearchForm')"
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
        row-id="FUNCTION_ID"
        :pager-config="{pageSize: 10}"
        :toolbar="toolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :select-config="{reserve: false}"
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
import { list } from "@/api/function";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  name: "FunctionSelect",
  data() {
    return {
      propertyFilter: {
        FUNCTION_NAME: { $instr: "" },
        FUNCTION_CODE: { $instr: "" },
        PATH: { $instr: "" }
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
        id: "full_select_1",
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
        { field: "FUNCTION_ID", visible: false },
        { field: "DIRECTION", visible: false },
        { field: "PARAMETERS", visible: false },
        { field: "WEB_HOST_NAME", visible: false },
        { field: "WEB_AGENT_NAME", visible: false },
        { field: "WEB_HTML_CALL", visible: false },
        { field: "WEB_ENCRYPT_PARAMETERS", visible: false },
        { field: "WEB_SECURED", visible: false },
        { field: "WEB_ICON", visible: false },
        { field: "OBJECT_ID", visible: false },
        { field: "CONTEXT_DEPENDENCE", visible: false },
        { field: "HIDDEN", visible: false },
        { field: "METHOD_NAME", visible: false },
        { field: "COMPATIBILITY", visible: false },
        { field: "ASSOC_FUNCTION_NAME", visible: false },
        { field: "CLASS_ID", visible: false },
        { field: "SCHEMA_VALIDATION_FLAG", visible: false },
        { field: "SCHEMA", visible: false },
        { field: "PORT", visible: false },
        { field: "REDIRECT", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "radio", width: 50 },
        { type: "index", width: 60 },
        { field: "FUNCTION_ID", title: "功能标识", remoteSort: true },
        { field: "FUNCTION_CODE", title: "功能代码", remoteSort: true },
        { field: "FUNCTION_NAME", title: "功能名称", remoteSort: true },
        { field: "APPLICATION_ID", title: "功能所属应用", remoteSort: true },
        { field: "DIRECTION", title: "功能映射方向", remoteSort: true },
        { field: "PARAMETERS", title: "功能参数", remoteSort: true },
        { field: "TYPE", title: "功能类型", remoteSort: true },
        { field: "WEB_HOST_NAME", title: "主机名称", remoteSort: true },
        { field: "WEB_AGENT_NAME", title: "代理名称", remoteSort: true },
        { field: "WEB_HTML_CALL", title: "HTML回调", remoteSort: true },
        {
          field: "WEB_ENCRYPT_PARAMETERS",
          title: "加密参数",
          remoteSort: true
        },
        { field: "WEB_SECURED", title: "安全标识", remoteSort: true },
        { field: "WEB_ICON", title: "图标", remoteSort: true },
        { field: "OBJECT_ID", title: "OBJECT_ID", remoteSort: true },
        { field: "CONTEXT_DEPENDENCE", title: "上下文依赖", remoteSort: true },
        { field: "PATH", title: "访问路径", remoteSort: true },
        { field: "COMPONENT", title: "前端组件", remoteSort: true },
        { field: "HIDDEN", title: "是否隐藏", remoteSort: true },
        { field: "METHOD_NAME", title: "方法名", remoteSort: true },
        { field: "COMPATIBILITY", title: "兼容性", remoteSort: true },
        { field: "ASSOC_FUNCTION_NAME", title: "关联功能", remoteSort: true },
        { field: "CLASS_ID", title: "类别标识", remoteSort: true },
        {
          field: "SCHEMA_VALIDATION_FLAG",
          title: "协议校验标识",
          remoteSort: true
        },
        { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
        { field: "CREATED_BY", title: "创建人", remoteSort: true },
        { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
        { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true },
        { field: "SCHEMA", title: "协议", remoteSort: true },
        { field: "PORT", title: "端口", remoteSort: true },
        { field: "META", title: "元信息", remoteSort: true },
        { field: "REDIRECT", title: "重定向", remoteSort: true },
        {
          field: "DESCRIPTION",
          title: "功能描述",
          remoteSort: true,
          showOverflow: true
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
    showFuncSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideFuncSelect(e) {
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
