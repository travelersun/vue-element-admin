<template>
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
            <el-button type="primary" icon="el-icon-search" @click="searchForm('menuFilterForm')">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="resetForm('menuFilterForm')">重置</el-button>
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
      row-id="MENU_ID"
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
        <el-form-item label="菜单标识" prop="MENU_ID">
          <el-input
            v-model="editDialog.formData.MENU_ID"
            clearable
            placeholder="菜单标识"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="菜单代码"
          prop="MENU_CODE"
          :rules="[{required:true, message:'功能代码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.MENU_CODE"
            clearable
            placeholder="菜单代码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="菜单名称"
          prop="MENU_NAME"
          :rules="[{required:true,message:'请输入菜单名称', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.MENU_NAME"
            clearable
            placeholder="请输入菜单名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="TYPE"
          :rules="[{required:true,message:'请选择菜单类型', trigger:'blur'}]"
        >
          <el-select v-model="editDialog.formData.TYPE" placeholder="请选择菜单类型" style="width: 90%">
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
          label="重定向"
          prop="REDIRECT"
          :rules="[{required:true,message:'请输入重定向路径', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.REDIRECT"
            clearable
            placeholder="请输入重定向路径"
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
        <el-form-item label="是否显示" prop="ALWAYS_SHOW">
          <el-select
            v-model="editDialog.formData.ALWAYS_SHOW"
            placeholder="请选择是否显示"
            style="width: 90%"
          >
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
        <el-form-item label="菜单描述" prop="DESCRIPTION">
          <el-input
            v-model="editDialog.formData.DESCRIPTION"
            type="textarea"
            clearable
            placeholder="菜单描述"
            style="width: 90%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="viewTreeDialog.visible"
      :title="viewTreeDialog.title"
      width="70%"
      :before-close="closeViewTreeDialog"
    >
      <el-form ref="viewTreeForm" label-width="20%" :model="viewTreeDialog.formData">
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单标识" prop="menuData.MENU_ID" hidden>
              <el-input
                v-model="viewTreeDialog.formData.menuData.MENU_ID"
                clearable
                readonly
                hidden
              />
            </el-form-item>
            <el-form-item label="菜单代码" prop="menuData.MENU_CODE">
              <el-input v-model="viewTreeDialog.formData.menuData.MENU_CODE" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="菜单名称" prop="menuData.MENU_NAME">
              <el-input v-model="viewTreeDialog.formData.menuData.MENU_NAME" clearable readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单类型" prop="menuData.TYPE">
              <el-select v-model="viewTreeDialog.formData.menuData.TYPE">
                <el-option value="vue" label="Vue路由" />
                <el-option value="wwwlink" label="超链接" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="菜单描述" prop="menuData.DESCRIPTION">
              <el-input v-model="viewTreeDialog.formData.menuData.DESCRIPTION" clearable readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <vxe-grid
          ref="viewTreeGrid"
          border
          resizable
          highlight-hover-row
          remote-filter
          max-height="530"
          row-id="id"
          :tree-config="{children: 'children'}"
          :customs.sync="viewTreeDialog.customColumns"
          :toolbar="viewTreeDialog.tableToolbar"
          :proxy-config="viewTreeDialog.tableProxy"
          :columns="viewTreeDialog.tableColumn"
        />
      </el-form>
      <div slot="footer">
        <el-button @click="closeViewTreeDialog">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editTreeDialog.visible"
      :title="editTreeDialog.title"
      width="70%"
      :before-close="closeEditTreeDialog"
    >
      <el-form ref="editTreeForm" label-width="20%" :model="editTreeDialog.formData">
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单标识" prop="menuData.MENU_ID" hidden>
              <el-input
                v-model="editTreeDialog.formData.menuData.MENU_ID"
                clearable
                readonly
                hidden
              />
            </el-form-item>
            <el-form-item label="菜单代码" prop="menuData.MENU_CODE">
              <el-input v-model="editTreeDialog.formData.menuData.MENU_CODE" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="菜单名称" prop="menuData.MENU_NAME">
              <el-input v-model="editTreeDialog.formData.menuData.MENU_NAME" clearable readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="菜单类型" prop="menuData.TYPE">
              <el-select v-model="editTreeDialog.formData.menuData.TYPE">
                <el-option value="vue" label="Vue路由" />
                <el-option value="wwwlink" label="超链接" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="菜单描述" prop="menuData.DESCRIPTION">
              <el-input v-model="editTreeDialog.formData.menuData.DESCRIPTION" clearable readonly />
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
          :customs.sync="menuEntry.customColumns"
          :pager-config="{pageSize: 10}"
          :toolbar="menuEntry.tableToolbar"
          :proxy-config="menuEntry.tableProxy"
          :columns="menuEntry.tableColumn"
          :select-config="{reserve: true}"
          :edit-rules="menuEntry.validRules"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          @cell-click="editMenuEnrtyEvent"
          @edit-actived="editMenuEnrtyActived"
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
  listMenuEntry,
  saveMenuEntry,
  delMenuEntry,
  listMenuTree
} from "@/api/menu";
import { deleteEmptyProperty, isJSON } from "@/utils/util";
import FunctionSelect from "@/components/FunctionSelect";
import MenuSelect from "@/components/MenuSelect";

export default {
  components: { FunctionSelect, MenuSelect },
  data() {
    return {
      propertyFilter: {
        MENU_NAME: { $instr: "" },
        MENU_CODE: { $instr: "" },
        PATH: { $instr: "" }
      },
      functionSelectVisible: false,
      menuSelectVisible: false,
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
      viewTreeDialog: {
        title: "菜单查看器",
        visible: false,
        formData: {
          menuData: {},
          menuEntryData: []
        },
        tableProxy: {
          index: false,
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: ({ page, sort, filters }) => {
              if (
                this.viewTreeDialog.formData.menuData &&
                this.viewTreeDialog.formData.menuData.MENU_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  MENU_ID: this.viewTreeDialog.formData.menuData.MENU_ID
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
                  listMenuTree({ jsonFilter, page })
                    .then(res => {
                      if (res.data.code !== "0") {
                        this.$message.error(res.data.message);
                        reject([]);
                      }
                      const treeData = this.$utils.toArrayTree(res.data.data, { key: 'SUB_MENU_ID', parentKey: 'MENU_ID', children: 'children' });
                      resolve(treeData);
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
            }
          }
        },
        tableToolbar: {
          id: "menuEntry_view_1",
          buttons: [{ code: "reload", name: "刷新", disabled: false }],
          refresh: true,
          resizable: {
            storage: true
          },
          setting: {
            storage: true
          }
        },
        customColumns: [
          { field: "ENTRY_ID", visible: false },
          { field: "MENU_ID", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "index", width: 60 },
          {
            field: "MENU_ID",
            title: "菜单标识"
          },
          {
            field: "SUB_MENU_ID",
            title: "子菜单ID",
            treeNode: true
          },
          {
            field: "ENTRY_SEQUENCE",
            title: "序号"
          },
          {
            field: "ENTRY_ID",
            title: "菜单进入点标识"
          },
          {
            field: "SUB_MENU_CODE",
            title: "子菜单代码"
          },
          {
            field: "SUB_MENU_NAME",
            title: "子菜单名称"
          },
          {
            field: "FUNCTION_ID",
            title: "子功能ID"
          },
          {
            field: "FUNCTION_CODE",
            title: "子功能代码"
          },
          {
            field: "FUNCTION_NAME",
            title: "子功能名称"
          },
          {
            field: "GRANT_FLAG",
            title: "授权标识",
            editRender: {
              name: "select",
              defaultValue: "Y",
              options: [
                { label: "是", value: "Y" },
                { label: "否", value: "N" }
              ]
            }
          },
          { field: "CREATION_DATE", title: "创建时间" },
          { field: "CREATED_BY", title: "创建人" },
          { field: "LAST_UPDATE_DATE", title: "修改时间" },
          { field: "LAST_UPDATED_BY", title: "修改人" }
        ]
      },
      editTreeDialog: {
        title: "菜单结构",
        visible: false,
        viewOnly: false,
        formData: {
          menuData: {},
          menuEntryData: []
        }
      },
      menuEntry: {
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
                this.editTreeDialog.formData.menuData &&
                this.editTreeDialog.formData.menuData.MENU_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  MENU_ID: this.editTreeDialog.formData.menuData.MENU_ID
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
                  listMenuEntry({ jsonFilter, page })
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
                delMenuEntry({
                  menuData: this.editTreeDialog.formData.menuData,
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
                saveMenuEntry({
                  menuData: this.editTreeDialog.formData.menuData,
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
          id: "menuEntry_edit_1",
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
          ENTRY_SEQUENCE: [
            { required: true, message: "请输入序号", trigger: "blur" },
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
          GRANT_FLAG: [
            { required: true, message: "请选择授权标识", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "MENU_ID", visible: false },
          { field: "ENTRY_ID", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "selection", width: 50 },
          {
            field: "MENU_ID",
            title: "菜单标识"
          },
          {
            field: "ENTRY_ID",
            title: "菜单进入点标识"
          },
          {
            field: "ENTRY_SEQUENCE",
            title: "序号",
            remoteSort: true,
            editRender: { name: "input" }
          },
          {
            field: "SUB_MENU_ID",
            title: "子菜单ID",
            remoteSort: true,
            editRender: { name: "input" }
          },
          {
            field: "SUB_MENU_CODE",
            title: "子菜单代码",
            remoteSort: true
          },
          {
            field: "SUB_MENU_NAME",
            title: "子菜单名称",
            remoteSort: true
          },
          {
            field: "FUNCTION_ID",
            title: "子功能ID",
            remoteSort: true,
            editRender: { name: "input" }
          },
          {
            field: "FUNCTION_CODE",
            title: "子功能代码",
            remoteSort: true
          },
          {
            field: "FUNCTION_NAME",
            title: "子功能名称",
            remoteSort: true
          },
          {
            field: "GRANT_FLAG",
            title: "授权标识",
            remoteSort: true,
            editRender: {
              name: "select",
              defaultValue: "N",
              options: [
                { label: "是", value: "Y" },
                { label: "否", value: "N" }
              ]
            }
          },
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
        id: "full_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "viewTree", name: "查看树形结构" },
          { code: "editTree", name: "编辑菜单层级" }
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
        { field: "MENU_ID", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
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
      this.editTreeDialog.formData.menuData = {};
    },
    closeViewTreeDialog() {
      this.viewTreeDialog.visible = false;
      this.viewTreeDialog.formData.menuData = {};
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
    toolbarButtonClickEvent({ button }, event) {
      const rows = this.$refs.xGrid.getSelectRecords();
      switch (button.code) {
        case "viewTree":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.viewTreeDialog.formData.menuData = rows[0];
          this.viewTreeDialog.visible = true;
          if (this.$refs.viewTreeGrid) {
            this.$refs.viewTreeGrid.commitProxy("query");
          }
          break;
        case "editTree":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.editTreeDialog.visible = true;
          this.editTreeDialog.formData.menuData = rows[0];
          if (this.$refs.xTreeGrid) {
            this.$refs.xTreeGrid.commitProxy("query");
          }
          break;
      }
    },
    editMenuEnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (!row.MENU_ID) {
        row.MENU_ID = this.editTreeDialog.formData.menuData.MENU_ID;
      }
      if (column.property === "SUB_MENU_ID") {
        this.$refs.mSelect.showFuncSelect(row);
      }
      if (column.property === "FUNCTION_ID") {
        this.$refs.fSelect.showFuncSelect(row);
      }
    },
    editMenuEnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {
      if (!row.MENU_ID) {
        row.MENU_ID = this.editTreeDialog.formData.menuData.MENU_ID;
      }
    },
    funcSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.FUNCTION_ID = e.FUNCTION_ID;
          currentRow.FUNCTION_CODE = e.FUNCTION_CODE;
          currentRow.FUNCTION_NAME = e.FUNCTION_NAME;
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
          currentRow.SUB_MENU_ID = e.MENU_ID;
          currentRow.SUB_MENU_CODE = e.MENU_CODE;
          currentRow.SUB_MENU_NAME = e.MENU_NAME;
        }
        this.$refs.mSelect.hideFuncSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    menuSelectCancel(e) {
      this.$refs.mSelect.hideFuncSelect();
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
