<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
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
      row-id="FUNCTION_ID"
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
        <el-form-item label="功能标识" prop="FUNCTION_ID">
          <el-input
            v-model="editDialog.formData.FUNCTION_ID"
            clearable
            placeholder="功能标识"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item label="功能所属应用标识" prop="APPLICATION_ID" :rules="numberRule">
          <el-input
            v-model="editDialog.formData.APPLICATION_ID"
            clearable
            placeholder="功能所属应用标识"
            style="width: 90%"
            @focus="selectApp"
          />
        </el-form-item>
        <el-form-item label="功能所属应用" prop="APPLICATION_SHORT_NAME">
          <el-input
            v-model="editDialog.formData.APPLICATION_SHORT_NAME"
            clearable
            readonly
            placeholder="功能所属应用"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="功能代码"
          prop="FUNCTION_CODE"
          :rules="[{required:true, message:'功能代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.FUNCTION_CODE"
            clearable
            placeholder="功能代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="功能名称"
          prop="FUNCTION_NAME"
          :rules="[{required:true,message:'请输入功能名称', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.FUNCTION_NAME"
            clearable
            placeholder="请输入功能名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="功能类型"
          prop="TYPE"
          :rules="[{required:true,message:'请选择功能类型', trigger:'blur'}]"
        >
          <el-select v-model="editDialog.formData.TYPE" placeholder="请选择功能类型" style="width: 90%">
            <el-option value="vue" label="Vue路由" />
            <el-option value="wwwlink" label="超链接" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="访问路径"
          prop="PATH"
          :rules="[{required:true,message:'请输入访问路径', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.PATH"
            clearable
            placeholder="请输入访问路径"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="前端组件"
          prop="COMPONENT"
          :rules="[{required:true,message:'请输入前端组件', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.COMPONENT"
            clearable
            placeholder="请输入前端组件"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="HIDDEN">
          <el-select v-model="editDialog.formData.HIDDEN" placeholder="请选择是否隐藏" style="width: 90%">
            <el-option value="1" label="是" />
            <el-option value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="元信息" prop="META">
          <el-input
            v-model="editDialog.formData.META"
            type="textarea"
            clearable
            placeholder="元信息(json)"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="功能描述" prop="DESCRIPTION">
          <el-input
            v-model="editDialog.formData.DESCRIPTION"
            type="textarea"
            clearable
            placeholder="功能描述"
            style="width: 90%"
          />
        </el-form-item>
        <application-select ref="appSelect" @okClick="appSelectOk" @cancelClick="appSelectCancel" />
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
import { list, save, del } from "@/api/function";
import { deleteEmptyProperty, isJSON } from "@/utils/util";
import ApplicationSelect from "@/components/ApplicationSelect";

export default {
  components: { ApplicationSelect },
  data() {
    return {
      propertyFilter: {
        FUNCTION_NAME: { $instr: "" },
        FUNCTION_CODE: { $instr: "" },
        PATH: { $instr: "" }
      },
      numberRule: [
        { required: true, message: "功能所属应用", trigger: "blur" },
        {
          validator(rule, value, callback) {
            if (Number.isInteger(Number(value))) {
              callback();
            } else {
              callback(new Error("请输入整数"));
            }
          },
          trigger: "blur"
        }
      ],
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
        { field: "FUNCTION_ID", visible: false },
        { field: "APPLICATION_ID", visible: false },
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
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "FUNCTION_ID", title: "功能标识", remoteSort: true },
        { field: "FUNCTION_CODE", title: "功能代码", remoteSort: true },
        { field: "FUNCTION_NAME", title: "功能名称", remoteSort: true },
        {
          field: "APPLICATION_ID",
          title: "功能所属应用标识",
          remoteSort: true
        },
        {
          field: "APPLICATION_SHORT_NAME",
          title: "功能所属应用",
          remoteSort: true
        },
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
        if (
          theThis.editDialog.formData.META &&
          !isJSON(theThis.editDialog.formData.META)
        ) {
          theThis.$message.error("元信息必须为有效json!");
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
    },
    selectApp(e) {
      this.$refs.appSelect.showFuncSelect();
    },
    appSelectOk(e, i) {
      if (e) {
        this.$set(this.editDialog.formData, "APPLICATION_ID", e.APPLICATION_ID);
        this.$set(
          this.editDialog.formData,
          "APPLICATION_SHORT_NAME",
          e.APPLICATION_SHORT_NAME
        );
        this.$refs.appSelect.hideFuncSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    appSelectCancel(e) {
      this.$refs.appSelect.hideFuncSelect();
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
