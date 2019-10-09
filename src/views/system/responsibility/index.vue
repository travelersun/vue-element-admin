<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="filterForm" :model="propertyFilter" :inline="true" size="small">
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
      width="50%"
      top="5vh"
    >
      <el-form ref="editForm" label-width="20%" :model="editDialog.formData">
        <el-form-item
          label="所属应用标识"
          prop="APPLICATION_ID"
          :rules="[{required:true,message:'请选择所属应用', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.APPLICATION_ID"
            clearable
            placeholder="所属应用标识"
            style="width: 90%"
            :rules="numberRule"
            @focus="selectApp"
          />
        </el-form-item>
        <el-form-item label="所属应用简称" prop="APPLICATION_SHORT_NAME">
          <el-input
            v-model="editDialog.formData.APPLICATION_SHORT_NAME"
            placeholder="所属应用简称"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="职责代码"
          prop="RESPONSIBILITY_KEY"
          :rules="[{required:true,message:'请输入职责代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.RESPONSIBILITY_KEY"
            clearable
            placeholder="职责代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="职责名称"
          prop="RESPONSIBILITY_NAME"
          :rules="[{required:true,message:'职责名称', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.RESPONSIBILITY_NAME"
            clearable
            placeholder="职责名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="顶级菜单ID"
          prop="MENU_ID"
          :rules="[{required:true,message:'顶级菜单ID', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.MENU_ID"
            clearable
            placeholder="顶级菜单ID"
            style="width: 90%"
            @focus="selectMenu"
          />
        </el-form-item>
        <el-form-item label="顶级菜单名称" prop="MENU_NAME">
          <el-input
            v-model="editDialog.formData.MENU_NAME"
            readonly
            placeholder="顶级菜单名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="启用日期" prop="START_DATE">
          <el-date-picker
            v-model="editDialog.formData.START_DATE"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="END_DATE">
          <el-date-picker
            v-model="editDialog.formData.END_DATE"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item label="描述" prop="RESPONSIBILITY_DESCRIPTION">
          <el-input
            v-model="editDialog.formData.RESPONSIBILITY_DESCRIPTION"
            type="textarea"
            :rows="4"
            clearable
            placeholder="描述"
            style="width: 90%"
          />
        </el-form-item>
        <menu-select ref="emSelect" @okClick="emenuSelectOk" @cancelClick="emenuSelectCancel" />
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
      top="5vh"
    >
      <el-form ref="editTreeForm" label-width="20%" :model="editTreeDialog.formData">
        <el-form-item label="所属应用标识" prop="respData.APPLICATION_ID" hidden>
          <el-input
            v-model="editTreeDialog.formData.respData.APPLICATION_ID"
            clearable
            placeholder="所属应用标识"
            style="width: 90%"
            hidden
          />
        </el-form-item>
        <el-form-item label="所属应用简称" prop="respData.APPLICATION_SHORT_NAME" hidden>
          <el-input
            v-model="editTreeDialog.formData.respData.APPLICATION_SHORT_NAME"
            placeholder="所属应用简称"
            style="width: 90%"
            readonly
            hidden
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职责代码" prop="respData.RESPONSIBILITY_KEY">
              <el-input
                v-model="editTreeDialog.formData.respData.RESPONSIBILITY_KEY"
                readonly
                placeholder="职责代码"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职责名称" prop="respData.RESPONSIBILITY_NAME">
              <el-input
                v-model="editTreeDialog.formData.respData.RESPONSIBILITY_NAME"
                readonly
                placeholder="职责名称"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="顶级菜单ID" prop="respData.MENU_ID">
              <el-input
                v-model="editTreeDialog.formData.respData.MENU_ID"
                readonly
                placeholder="顶级菜单ID"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顶级菜单名称" prop="respData.MENU_NAME">
              <el-input
                v-model="editTreeDialog.formData.respData.MENU_NAME"
                readonly
                placeholder="顶级菜单名称"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="启用日期" prop="respData.START_DATE">
              <el-date-picker
                v-model="editTreeDialog.formData.respData.START_DATE"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="respData.END_DATE">
              <el-date-picker
                v-model="editTreeDialog.formData.respData.END_DATE"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="描述" prop="respData.RESPONSIBILITY_DESCRIPTION">
              <el-input
                v-model="editTreeDialog.formData.respData.RESPONSIBILITY_DESCRIPTION"
                type="textarea"
                :rows="4"
                readonly
                placeholder="描述"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
        <function-select ref="fSelect" @okClick="funcSelectOk" @cancelClick="funcSelectCancel" />
        <menu-select ref="mSelect" @okClick="menuSelectOk" @cancelClick="menuSelectCancel" />
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditTreeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  save,
  del,
  listExclusion,
  saveExclusion,
  delExclusion
} from "@/api/responsibility";
import { deleteEmptyProperty } from "@/utils/util";
import ApplicationSelect from "@/components/ApplicationSelect";
import FunctionSelect from "@/components/FunctionSelect";
import MenuSelect from "@/components/MenuSelect";

export default {
  components: { ApplicationSelect, FunctionSelect, MenuSelect },
  data() {
    return {
      propertyFilter: {
        RESPONSIBILITY_NAME: { $instr: "" },
        RESPONSIBILITY_KEY: { $instr: "" },
        RESPONSIBILITY_DESCRIPTION: { $instr: "" }
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
        title: "职责排除项列表",
        visible: false,
        viewOnly: false,
        formData: {
          respData: {},
          respExcluData: []
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
                this.editTreeDialog.formData.respData &&
                this.editTreeDialog.formData.respData.RESPONSIBILITY_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  RESPONSIBILITY_ID: this.editTreeDialog.formData.respData
                    .RESPONSIBILITY_ID
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
                  listExclusion({ jsonFilter, page })
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
                delExclusion({
                  respData: this.editTreeDialog.formData.respData,
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
                saveExclusion({
                  respData: this.editTreeDialog.formData.respData,
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
          RULE_TYPE: [
            { required: true, message: "请选择排除类型", trigger: "blur" }
          ],
          ACTION_ID: [
            { required: true, message: "请选择排除项", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "EXCLUSION_ID", visible: false },
          { field: "APPLICATION_ID", visible: false },
          { field: "RESPONSIBILITY_ID", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "selection", width: 50 },
          { type: "index", width: 60 },
          { field: "EXCLUSION_ID", title: "快速代码", remoteSort: true },
          { field: "APPLICATION_ID", title: "查找代码", remoteSort: true },
          {
            field: "RESPONSIBILITY_ID",
            title: "查找代码解义",
            remoteSort: true
          },
          {
            field: "RULE_TYPE",
            title: "排除类型",
            remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "功能", value: "F" },
                { label: "菜单", value: "M" }
              ]
            }
          },
          {
            field: "ACTION_ID",
            title: "排除项ID",
            remoteSort: true,
            editRender: { name: "input" }
          },
          { field: "ACTION_NAME", title: "排除项名称", remoteSort: true },
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
                  this.$message.error(err.message);
                  reject();
                });
            });
          }
        }
      },
      toolbar: {
        id: "resp_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "editTree", name: "编辑职责排除项列表" }
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
        { type: "selection", width: 50 },
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
      this.editTreeDialog.formData.respData = {};
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
          this.editTreeDialog.formData.respData = rows[0];
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
      if (!row.APPLICATION_ID) {
        row.APPLICATION_ID = this.editTreeDialog.formData.respData.APPLICATION_ID;
      }
      if (!row.RESPONSIBILITY_ID) {
        row.RESPONSIBILITY_ID = this.editTreeDialog.formData.respData.RESPONSIBILITY_ID;
      }
      if (column.property === "ACTION_ID") {
        if (row.RULE_TYPE === "M") {
          this.$refs.mSelect.showFuncSelect(row);
        } else if (row.RULE_TYPE === "F") {
          this.$refs.fSelect.showFuncSelect(row);
        } else {
          this.$message.info("请先选择排除项类型!");
        }
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
      if (!row.APPLICATION_ID) {
        row.APPLICATION_ID = this.editTreeDialog.formData.respData.APPLICATION_ID;
      }
      if (!row.RESPONSIBILITY_ID) {
        row.RESPONSIBILITY_ID = this.editTreeDialog.formData.respData.RESPONSIBILITY_ID;
      }
    },
    selectApp(e) {
      this.$refs.appSelect.showFuncSelect();
    },
    selectMenu(e) {
      this.$refs.emSelect.showFuncSelect();
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
    },
    funcSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.ACTION_ID = e.FUNCTION_ID;
          currentRow.ACTION_NAME = e.FUNCTION_NAME;
        }
        this.$refs.fSelect.hideFuncSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    funcSelectCancel(e) {
      this.$refs.fSelect.hideFuncSelect();
    },
    menuSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.ACTION_ID = e.MENU_ID;
          currentRow.ACTION_NAME = e.MENU_NAME;
        }
        this.$refs.mSelect.hideFuncSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    menuSelectCancel(e) {
      this.$refs.mSelect.hideFuncSelect();
    },
    emenuSelectOk(e, i) {
      if (e) {
        this.$set(this.editDialog.formData, "MENU_ID", e.MENU_ID);
        this.$set(this.editDialog.formData, "MENU_NAME", e.MENU_NAME);
        this.$refs.emSelect.hideFuncSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    emenuSelectCancel(e) {
      this.$refs.emSelect.hideFuncSelect();
    }

  }
}
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
