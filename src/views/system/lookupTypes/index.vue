<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="filterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="所属应用" prop="APPLICATION_SHORT_NAME.$instr">
            <el-input v-model="propertyFilter.APPLICATION_SHORT_NAME.$instr" clearable placeholder="所属应用" />
          </el-form-item>
          <el-form-item label="快速代码" prop="LOOKUP_TYPE.$instr">
            <el-input v-model="propertyFilter.LOOKUP_TYPE.$instr" clearable placeholder="快速代码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchForm('filterForm')">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="resetForm('filterForm')">重置</el-button>
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
      row-id="id"
      :pager-config="{pageSize: 10}"
      :toolbar="toolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :select-config="{reserve: true}"
      @cell-dblclick="dbclick"
      @toolbar-button-click="toolbarButtonClickEvent"
    />
    <el-dialog
      :visible.sync="editDialog.visible"
      :before-close="closeEditDialog"
      :title="editDialog.title"
      width="40%"
    >
      <el-form ref="editForm" label-width="30%" :model="editDialog.formData">
        <el-form-item label="所属应用标识" prop="APPLICATION_ID" :rules="[{required:true,message:'请选择所属应用', trigger:'blur'}]">
          <el-input
            v-model="editDialog.formData.APPLICATION_ID"
            clearable
            placeholder="所属应用标识"
            style="width: 90%"
            :rules="numberRule"
            @focus="selectApp"
          />
        </el-form-item>
        <el-form-item label="所属应用简称" prop="APPLICATION_SHORT_NAME" :rules="[{required:true,message:'所属应用简称', trigger:'blur'}]">
          <el-input
            v-model="editDialog.formData.APPLICATION_SHORT_NAME"
            clearable
            placeholder="所属应用简称"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="快速代码"
          prop="LOOKUP_TYPE"
          :rules="[{required:true,message:'请输入快速代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.LOOKUP_TYPE"
            clearable
            placeholder="快速代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="自定义级别"
          prop="CUSTOMIZATION_LEVEL"
          :rules="[{required:true,message:'请选择自定义级别', trigger:'blur'}]"
        >
          <el-select v-model="editDialog.formData.CUSTOMIZATION_LEVEL" style="width: 90%">
            <el-option value="U" label="用户级" />
            <el-option value="E" label="可扩展级" />
            <el-option value="S" label="系统级" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="安全组"
          prop="SECURITY_GROUP_ID"
          hidden
        >
          <el-input
            v-model="editDialog.formData.SECURITY_GROUP_ID"
            clearable
            placeholder="安全组"
            hidden
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          prop="VIEW_APPLICATION_ID"
          hidden
        >
          <el-input
            v-model="editDialog.formData.VIEW_APPLICATION_ID"
            clearable
            hidden
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="DESCRRITION"
        >
          <el-input
            v-model="editDialog.formData.DESCRIPTION"
            type="textarea"
            :rows="4"
            clearable
            placeholder="描述"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="分配叶子节点"
          prop="ASSIGN_LEAF_ONLY"
          hidden
        >
          <el-input
            v-model="editDialog.formData.ASSIGN_LEAF_ONLY"
            clearable
            hidden
            placeholder="分配叶子节点"
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

    <el-dialog
      :visible.sync="editTreeDialog.visible"
      :title="editTreeDialog.title"
      width="70%"
      :before-close="closeEditTreeDialog"
    >
      <el-form ref="editTreeForm" label-width="20%" :model="editTreeDialog.formData">
        <el-form-item label="所属应用标识" prop="lookTypeData.APPLICATION_ID" :rules="[{required:true,message:'请选择所属应用', trigger:'blur'}]">
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.APPLICATION_ID"
            readonly
            placeholder="所属应用标识"
            style="width: 90%"
            :rules="numberRule"
          />
        </el-form-item>
        <el-form-item
          label="快速代码"
          prop="lookTypeData.LOOKUP_TYPE"
          :rules="[{required:true,message:'请输入快速代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.LOOKUP_TYPE"
            readonly
            placeholder="快速代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="自定义级别"
          prop="lookTypeData.CUSTOMIZATION_LEVEL"
          :rules="[{required:true,message:'请选择自定义级别', trigger:'blur'}]"
        >
          <el-select v-model="editTreeDialog.formData.lookTypeData.CUSTOMIZATION_LEVEL" style="width: 90%">
            <el-option value="U" label="用户级" />
            <el-option value="E" label="可扩展级" />
            <el-option value="S" label="系统级" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="安全组"
          prop="lookTypeData.SECURITY_GROUP_ID"
          hidden
        >
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.SECURITY_GROUP_ID"
            clearable
            placeholder="安全组"
            hidden
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          prop="lookTypeData.VIEW_APPLICATION_ID"
          hidden
        >
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.VIEW_APPLICATION_ID"
            clearable
            hidden
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="lookTypeData.DESCRIPTION"
        >
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.DESCRIPTION"
            type="textarea"
            :rows="4"
            clearable
            placeholder="描述"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="分配叶子节点"
          prop="lookTypeData.ASSIGN_LEAF_ONLY"
          hidden
        >
          <el-input
            v-model="editTreeDialog.formData.lookTypeData.ASSIGN_LEAF_ONLY"
            clearable
            hidden
            placeholder="分配叶子节点"
            style="width: 90%"
          />
        </el-form-item>
        <vxe-grid
          ref="xTreeGrid"
          border
          resizable
          highlight-hover-row
          remote-filter
          max-height="530"
          row-id="id"
          :customs.sync="valueEntry.customColumns"
          :pager-config="{pageSize: 10}"
          :toolbar="valueEntry.tableToolbar"
          :proxy-config="valueEntry.tableProxy"
          :columns="valueEntry.tableColumn"
          :select-config="{reserve: true}"
          :edit-rules="valueEntry.validRules"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          @cell-click="editValueEnrtyEvent"
          @edit-actived="editValueEnrtyActived"
        />
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditTreeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLookupType,
  saveLookupType,
  delLookupType,
  listLookupValues,
  saveLookupValues,
  delLookupValues
} from "@/api/fndLookup";
import { deleteEmptyProperty } from "@/utils/util";
import ApplicationSelect from "@/components/ApplicationSelect";

export default {
  components: { ApplicationSelect },
  data() {
    return {
      propertyFilter: {
        APPLICATION_SHORT_NAME: { $instr: "" },
        LOOKUP_TYPE: { $instr: "" }
      },
      numberRule: [
        { required: true, message: "请输入", trigger: "blur" },
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
      editTreeDialog: {
        title: "快速代码值列表",
        visible: false,
        viewOnly: false,
        formData: {
          lookTypeData: {},
          lookValueData: []
        }
      },
      valueEntry: {
        tableProxy: {
          index: false,
          sort: true, // 启用排序代理
          filter: false, // 启用筛选代理
          props: {
            result: "data.list",
            total: "data.total"
          },
          ajax: {
            query: ({ page, sort, filters }) => {
              if (
                this.editTreeDialog.formData.lookTypeData &&
                this.editTreeDialog.formData.lookTypeData.LOOKUP_TYPE
              ) {
                // 处理排序条件
                const jsonFilter = {
                  LOOKUP_TYPE: this.editTreeDialog.formData.lookTypeData.LOOKUP_TYPE
                };
                const sordProperty = sort.property;
                const sordOrder = sort.order;
                if (sordProperty && sordOrder) {
                  jsonFilter["$orderby"] = {};
                  jsonFilter["$orderby"][
                    sordProperty
                  ] = sordOrder.toUpperCase();
                }

                // 处理筛选条件
                filters.forEach(({ column, property, values }) => {
                  jsonFilter[property] = { $in: values };
                });

                deleteEmptyProperty(jsonFilter);

                return new Promise((resolve, reject) => {
                  listLookupValues({ jsonFilter, page })
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
              } else {
                return new Promise((resolve, reject) => {
                  resolve();
                });
              }
            },
            delete: ({ body }) => {
              return new Promise((resolve, reject) => {
                delLookupValues({
                  lookTypeData: this.editTreeDialog.formData.lookTypeData,
                  body
                })
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
                    this.$message.error(err.message);
                    reject();
                  });
              });
            },
            save: ({ body }) => {
              return new Promise((resolve, reject) => {
                saveLookupValues({
                  lookTypeData: this.editTreeDialog.formData.lookTypeData,
                  body
                })
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
                    this.$message.error(err.message);
                    reject();
                  });
              });
            }
          }
        },
        tableToolbar: {
          id: "valueEntry_edit_1",
          buttons: [
            { code: "reload", name: "刷新", disabled: false },
            { code: "delete_selection", name: "删除选中" },
            { code: "insert_actived", name: "新增", disabled: false },
            { code: "save", name: "保存", disabled: false }
          ],
          refresh: true,
          resizable: {
            storage: true
          },
          setting: {
            storage: true
          }
        },
        validRules: {
          LOOKUP_TYPE: [
            { required: true, message: "请输入代码", trigger: "blur" }
          ],
          LOOKUP_CODE: [
            { required: true, message: "请输入查找代码", trigger: "blur" }
          ],
          MEANING: [
            { required: true, message: "请输入码解义", trigger: "blur" }
          ],
          ENABLED_FLAG: [
            { required: true, message: "请选择启用标识", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "LOOKUP_TYPE", visible: false },
          { field: "START_DATE_ACTIVE", visible: false },
          { field: "END_DATE_ACTIVE", visible: false },
          { field: "SECURITY_GROUP_ID", visible: false },
          { field: "VIEW_APPLICATION_ID", visible: false },
          { field: "TAG", visible: false },
          { field: "LEAF_NODE", visible: false },
          { field: "ATTRIBUTE_CATEGORY", visible: false },
          { field: "ATTRIBUTE1", visible: false },
          { field: "ATTRIBUTE2", visible: false },
          { field: "ATTRIBUTE3", visible: false },
          { field: "ATTRIBUTE4", visible: false },
          { field: "ATTRIBUTE5", visible: false },
          { field: "ATTRIBUTE6", visible: false },
          { field: "ATTRIBUTE7", visible: false },
          { field: "ATTRIBUTE8", visible: false },
          { field: "ATTRIBUTE9", visible: false },
          { field: "ATTRIBUTE10", visible: false },
          { field: "ATTRIBUTE11", visible: false },
          { field: "ATTRIBUTE12", visible: false },
          { field: "ATTRIBUTE13", visible: false },
          { field: "ATTRIBUTE14", visible: false },
          { field: "ATTRIBUTE15", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "selection", width: 50 },
          { type: "index", width: 60 },
          { field: "LOOKUP_TYPE", title: "快速代码", remoteSort: true },
          { field: "LOOKUP_CODE", title: "查找代码", remoteSort: true, editRender: { name: "input" }},
          { field: "MEANING", title: "查找代码解义", remoteSort: true, editRender: { name: "input" }},
          { field: "ENABLED_FLAG", title: "启用标识", remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "否", value: "N" },
                { label: "是", value: "Y" }
              ]
            }
          },
          { field: "DESCRIPTION", title: "描述", remoteSort: true, editRender: { name: "input" }},
          { field: "START_DATE_ACTIVE", title: "开始日期", remoteSort: true },
          { field: "END_DATE_ACTIVE", title: "结束日期", remoteSort: true },
          { field: "SECURITY_GROUP_ID", title: "安全组", remoteSort: true },
          { field: "VIEW_APPLICATION_ID", title: "视图应用id", remoteSort: true },
          { field: "TAG", title: "标签", remoteSort: true },
          { field: "LEAF_NODE", title: "叶子节点", remoteSort: true },
          { field: "ATTRIBUTE_CATEGORY", title: "弹性域", remoteSort: true },
          { field: "ATTRIBUTE1", title: "弹性域属性1", remoteSort: true },
          { field: "ATTRIBUTE2", title: "弹性域属性2", remoteSort: true },
          { field: "ATTRIBUTE3", title: "弹性域属性3", remoteSort: true },
          { field: "ATTRIBUTE4", title: "弹性域属性4", remoteSort: true },
          { field: "ATTRIBUTE5", title: "弹性域属性5", remoteSort: true },
          { field: "ATTRIBUTE6", title: "弹性域属性6", remoteSort: true },
          { field: "ATTRIBUTE7", title: "弹性域属性7", remoteSort: true },
          { field: "ATTRIBUTE8", title: "弹性域属性8", remoteSort: true },
          { field: "ATTRIBUTE9", title: "弹性域属性9", remoteSort: true },
          { field: "ATTRIBUTE10", title: "弹性域属性10", remoteSort: true },
          { field: "ATTRIBUTE11", title: "弹性域属性11", remoteSort: true },
          { field: "ATTRIBUTE12", title: "弹性域属性12", remoteSort: true },
          { field: "ATTRIBUTE13", title: "弹性域属性13", remoteSort: true },
          { field: "ATTRIBUTE14", title: "弹性域属性14", remoteSort: true },
          { field: "ATTRIBUTE15", title: "弹性域属性15", remoteSort: true },
          { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
          { field: "CREATED_BY", title: "创建人", remoteSort: true },
          { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
          { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
        ]
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
              if (values && values.length > 0) {
                jsonFilter[property] = values[0];
              }
            });

            deleteEmptyProperty(jsonFilter);

            return new Promise((resolve, reject) => {
              listLookupType({ jsonFilter, page })
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
          },
          delete: ({ body }) => {
            return new Promise((resolve, reject) => {
              delLookupType(body)
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
                  this.$message.error(err.message);
                  reject();
                });
            });
          }
        }
      },
      toolbar: {
        id: "dict_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "editTree", name: "编辑快速代码值列表" }
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
        { field: "SECURITY_GROUP_ID", visible: false },
        { field: "VIEW_APPLICATION_ID", visible: false },
        { field: "ASSIGN_LEAF_ONLY", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "LOOKUP_TYPE", title: "快速代码", remoteSort: true },
        { field: "DESCRIPTION", title: "描述", remoteSort: true, showOverflow: true },
        { field: "APPLICATION_SHORT_NAME", title: "应用简称", remoteSort: true },
        { field: "CUSTOMIZATION_LEVEL", title: "禁用标识", remoteSort: true,
          filters: [
            { label: "用户级", value: "U" },
            { label: "可扩展级", value: "E" },
            { label: "系统级", value: "S" }
          ],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [
              { label: "用户级", value: "U" },
              { label: "可扩展级", value: "E" },
              { label: "系统级", value: "S" }
            ]
          }
        },
        { field: "APPLICATION_ID", title: "应用标识", remoteSort: true },
        { field: "SECURITY_GROUP_ID", title: "安全组", remoteSort: true },
        { field: "VIEW_APPLICATION_ID", title: "视图应用id", remoteSort: true },
        { field: "ASSIGN_LEAF_ONLY", title: "父字典标识", remoteSort: true },
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
    closeEditTreeDialog() {
      this.editTreeDialog.visible = false;
      this.editTreeDialog.formData.lookTypeData = {};
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
        saveLookupType(theThis.editDialog.formData)
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
    toolbarButtonClickEvent({ button }, event) {
      const rows = this.$refs.xGrid.getSelectRecords();
      switch (button.code) {
        case "editTree":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.editTreeDialog.visible = true;
          this.editTreeDialog.formData.lookTypeData = rows[0];
          if (this.$refs.xTreeGrid) {
            this.$refs.xTreeGrid.commitProxy("query");
          }
          break;
      }
    },
    editValueEnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (!row.LOOKUP_TYPE) {
        row.LOOKUP_TYPE = this.editTreeDialog.formData.lookTypeData.LOOKUP_TYPE;
      }
    },
    editValueEnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {
      if (!row.LOOKUP_TYPE) {
        row.LOOKUP_TYPE = this.editTreeDialog.formData.dictData.LOOKUP_TYPE;
      }
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
