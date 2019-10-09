<template>
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
        <el-form-item label="权限(组)ID" prop="id">
          <el-input
            v-model="editDialog.formData.id"
            placeholder="权限(组)ID"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item label="权限(组)名称" prop="displayName">
          <el-input
            v-model="editDialog.formData.displayName"
            placeholder="权限(组)名称"
            style="width: 90%"
            clearable
          />
        </el-form-item>
        <el-form-item label="权限(组)描述" prop="description">
          <el-input
            v-model="editDialog.formData.description"
            placeholder="权限(组)描述"
            style="width: 90%"
            clearable
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
      top="5vh"
    >
      <el-form ref="viewTreeForm" label-width="20%" :model="viewTreeDialog.formData">
        <el-form-item label="权限(组)ID" prop="id" hidden>
          <el-input
            v-model="viewTreeDialog.formData.id"
            placeholder="权限(组)ID"
            style="width: 90%"
            readonly
            hidden
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限(组)名称" prop="displayName">
              <el-input
                v-model="viewTreeDialog.formData.displayName"
                placeholder="权限(组)名称"
                style="width: 90%"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="权限(组)描述" prop="description">
              <el-input
                v-model="viewTreeDialog.formData.description"
                placeholder="权限(组)描述"
                style="width: 90%"
                readonly
              />
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
          :customs.sync="viewTreeDialog.customColumns"
          :toolbar="viewTreeDialog.tableToolbar"
          :proxy-config="viewTreeDialog.tableProxy"
          :columns="viewTreeDialog.tableColumn"
          :edit-rules="viewTreeDialog.validRules"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          @cell-click="editGroupEnrtyEvent"
          @edit-actived="editGroupEnrtyActived"
        />
        <user-select ref="uSelect" @okClick="userSelectOk" @cancelClick="userSelectCancel" />
        <group-select ref="gSelect" @okClick="groupSelectOk" @cancelClick="groupSelectCancel" />
      </el-form>
      <div slot="footer">
        <el-button @click="closeViewTreeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import XEAjax from "xe-ajax";
import { list, create, update, del, addMember, removeMember, listMember } from "@/api/uaaGroup";
import { deleteEmptyProperty } from "@/utils/util";
import XEUtils from "xe-utils";
import UserSelect from "@/components/UserSelect";
import GroupSelect from "@/components/GroupSelect";

export default {
  components: { UserSelect, GroupSelect },
  data() {
    return {
      propertyFilter: {
        displayName: "",
        id: ""
      },
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
      viewTreeDialog: {
        title: "权限(组)成员管理",
        visible: false,
        viewOnly: false,
        formData: {},
        validRules: {
          type: [
            { required: true, message: "请选择成员类型", trigger: "blur" }
          ],
          value: [
            { required: true, message: "请选择成员", trigger: "blur" }
          ]
        },
        tableProxy: {
          index: false,
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: ({ page, sort, filters }) => {
              if (this.viewTreeDialog.formData.id) {
                return new Promise((resolve, reject) => {
                  listMember(this.viewTreeDialog.formData.id, true)
                    .then(res => {
                      resolve(res.data);
                    })
                    .catch(err => {
                      this.$message.error(err.message);
                      reject(err);
                    });
                });
              } else {
                return new Promise((resolve, reject) => {
                  resolve([]);
                });
              }
            },
            delete: ({ body }) => {
              var removeRecords = body.removeRecords;
              if (removeRecords && removeRecords.length > 1) {
                for (var i = 0; i < removeRecords.length; i++) {
                  removeMember(this.viewTreeDialog.formData.id, removeRecords[i].value)
                    .then(res => {})
                    .catch(err => {
                      this.$message.error(err.data);
                    });
                }
                return new Promise((resolve, reject) => {
                  this.$message.success("删除成功!");
                  resolve();
                });
              } else if (removeRecords && removeRecords.length === 1) {
                return new Promise((resolve, reject) => {
                  removeMember(this.viewTreeDialog.formData.id, removeRecords[0].value)
                    .then(res => {
                      this.$message.success("删除成功!");
                      resolve();
                    })
                    .catch(err => {
                      this.$message.error(err.data);
                      reject();
                    });
                });
              }
            },
            save: ({ body }) => {
              var insertRecords = body.insertRecords;

              if (insertRecords && insertRecords.length > 0) {
                for (var i = 0; i < insertRecords.length; i++) {
                  addMember(this.viewTreeDialog.formData.id, { origin: "uaa", type: insertRecords[i].type, value: insertRecords[i].value })
                    .then(res => {})
                    .catch(err => {
                      this.$message.error(err.data);
                    });
                }
                return new Promise((resolve, reject) => {
                  this.$message.success("保存成功!");
                  resolve();
                });
              } else {
                return new Promise((resolve, reject) => {
                  this.$message.success("保存成功!");
                  resolve();
                });
              }
            }
          }
        },
        tableToolbar: {
          id: "memberEntry_view_1",
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
        customColumns: [{ field: "origin", visible: false }],
        tableColumn: [
          { type: "selection", width: 50 },
          { type: "index", width: 50 },
          {
            field: "origin",
            title: "来源",
            editRender: { name: "input" }
          },
          {
            field: "type",
            title: "成员类型",
            editRender: {
              name: "select",
              options: [
                { label: "用户", value: "USER" },
                { label: "权限(组)", value: "GROUP" }
              ]
            }
          },
          {
            field: "value",
            title: "成员ID",
            editRender: { name: "input" }
          },
          {
            field: "entity",
            title: "成员描述",
            formatter: function({
              cellValue,
              row,
              rowIndex,
              column,
              columnIndex
            }) {
              if (cellValue) {
                if (row.type === "USER") {
                  return cellValue.userName;
                } else if (row.type === "GROUP") {
                  return cellValue.displayName;
                } else {
                  return cellValue;
                }
              }
            }
          }
        ]
      },
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
          },
          delete: ({ body }) => {
            var removeRecords = body.removeRecords;
            if (removeRecords && removeRecords.length > 1) {
              for (var i = 0; i < removeRecords.length; i++) {
                del(removeRecords[i].id)
                  .then(res => {})
                  .catch(err => {
                    this.$message.error(err.data);
                  });
              }
              return new Promise((resolve, reject) => {
                this.$message.success("删除成功!");
                resolve();
              });
            } else if (removeRecords && removeRecords.length === 1) {
              return new Promise((resolve, reject) => {
                del(removeRecords[0].id)
                  .then(res => {
                    this.$message.success("删除成功!");
                    resolve();
                  })
                  .catch(err => {
                    this.$message.error(err.data);
                    reject();
                  });
              });
            }
          }
        }
      },
      toolbar: {
        id: "group_edit_1",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "viewTree", name: "权限组成员管理" }
        ],
        refresh: true,
        resizable: {
          storage: true
        },
        setting: {
          storage: true
        }
      },
      customColumns: [],
      tableColumn: [
        { type: "selection", width: 50 },
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
    toolbarButtonClickEvent({ button }, event) {
      const rows = this.$refs.xGrid.getSelectRecords();
      switch (button.code) {
        case "viewTree":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.viewTreeDialog.formData = rows[0];
          this.viewTreeDialog.visible = true;
          if (this.$refs.viewTreeGrid) {
            this.$refs.viewTreeGrid.commitProxy("query");
          }
          break;
      }
    },
    closeViewTreeDialog() {
      this.viewTreeDialog.visible = false;
      this.viewTreeDialog.formData = {};
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
        if (!theThis.editDialog.formData.id) {
          create(theThis.editDialog.formData)
            .then(res => {
              theThis.$message.success("创建成功!");
              theThis.closeEditDialog();
            })
            .catch(err => {
              theThis.$message.error(err.message);
            });
        } else {
          update(theThis.editDialog.formData.id, theThis.editDialog.formData)
            .then(res => {
              theThis.$message.success("修改成功!");
              theThis.closeEditDialog();
            })
            .catch(err => {
              theThis.$message.error(err.message);
            });
        }
      });
    },

    editGroupEnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (column.property === "value") {
        if (!row.type) {
          this.$message.info("请先选择成员类型!");
          return;
        }
        if (row.type === "USER") {
          this.$refs.uSelect.showUserSelect(row);
        }
        if (row.type === "GROUP") {
          this.$refs.gSelect.showGroupSelect(row);
        }
      }
    },
    editGroupEnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {

    },
    userSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.value = e.id;
          currentRow.entity = e.userName;
        }
        this.$refs.uSelect.hideUserSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    userSelectCancel(e) {
      this.$refs.uSelect.hideUserSelect();
    },
    groupSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.value = e.id;
          currentRow.entity = e.displayName;
        }
        this.$refs.gSelect.hideGroupSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    groupSelectCancel(e) {
      this.$refs.gSelect.hideGroupSelect();
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
