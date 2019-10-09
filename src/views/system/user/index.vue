<template>
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
        <el-form-item label="用户ID" prop="id">
          <el-input
            v-model="editDialog.formData.id"
            placeholder="用户ID"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="userName"
          :rules="[{required:true, message:'用户名', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.userName"
            clearable
            placeholder="用户名"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          v-if="!editDialog.formData.id"
          label="用户密码"
          prop="password"
          :rules="[{required:true, message:'用户密码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.password"
            clearable
            placeholder="用户密码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="姓" prop="name.familyName">
          <el-input
            v-model="editDialog.formData.name.familyName"
            placeholder="姓"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="名"
          prop="name.givenName"
          :rules="[{required:true, message:'名', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.name.givenName"
            clearable
            placeholder="名"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phoneNumbers[0].value"
          :rules="[{required:true,message:'电话号码不能为空', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.phoneNumbers[0].value"
            clearable
            placeholder="电话"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="emails[0].value"
          :rules="[{required:true,message:'邮箱不能为空', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.emails[0].value"
            clearable
            placeholder="邮箱"
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
      top="5vh"
    >
      <el-form ref="viewTreeForm" label-width="20%" :model="viewTreeDialog.formData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="id">
              <el-input
                v-model="viewTreeDialog.formData.id"
                placeholder="用户ID"
                style="width: 90%"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="viewTreeDialog.formData.userName"
                readonly
                placeholder="用户名"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tab-container">
          <el-tabs style="margin-top:15px;" type="border-card">
            <el-tab-pane label="用户权限">
              <vxe-grid
                ref="userGroup"
                border
                resizable
                highlight-hover-row
                align="center"
                height="500"
                :columns="viewTreeDialog.userGroup.tableColumn"
                :data="viewTreeDialog.formData.groups"
              />
            </el-tab-pane>
            <el-tab-pane label="用户授权">
              <vxe-grid
                ref="userApprovals"
                border
                resizable
                height="500"
                align="center"
                highlight-hover-row
                :columns="viewTreeDialog.userApprovals.tableColumn"
                :data="viewTreeDialog.formData.approvals"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="closeViewTreeDialog">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="userRespDialog.visible"
      :title="userRespDialog.title"
      width="70%"
      :before-close="closeUserRespDialog"
      top="5vh"
    >
      <el-form ref="userRespForm" label-width="20%" :model="userRespDialog.formData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="id">
              <el-input
                v-model="userRespDialog.formData.id"
                placeholder="用户ID"
                style="width: 90%"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="userRespDialog.formData.userName"
                readonly
                placeholder="用户名"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tab-container">
          <el-tabs style="margin-top:15px;" type="border-card">
            <el-tab-pane label="用户直接职责">
              <vxe-grid
                ref="userDirectRespGrid"
                border
                resizable
                highlight-hover-row
                align="center"
                height="500"
                show-overflow
                show-header-overflow
                :customs.sync="userRespDialog.userDirectResp.customColumns"
                :columns="userRespDialog.userDirectResp.tableColumn"
                :toolbar="userRespDialog.userDirectResp.tableToolbar"
                :proxy-config="userRespDialog.userDirectResp.tableProxy"
                :select-config="{reserve: true}"
                :edit-rules="userRespDialog.userDirectResp.validRules"
                :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
                @cell-click="editUDREnrtyEvent"
                @edit-actived="editUDREnrtyActived"
              />
            </el-tab-pane>
            <el-tab-pane label="用户间接职责">
              <vxe-grid
                ref="userInDirectRespGrid"
                border
                resizable
                height="500"
                align="center"
                highlight-hover-row
              />
            </el-tab-pane>
          </el-tabs>
        </div>
        <resp-select ref="rSelect" @okClick="respSelectOk" @cancelClick="respSelectCancel" />
      </el-form>
      <div slot="footer">
        <el-button @click="closeUserRespDialog">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="chgpwdDialog.visible"
      :title="chgpwdDialog.title"
      width="70%"
      :before-close="closeChgpwdDialog"
    >
      <el-form ref="chgpwdForm" label-width="20%" :model="chgpwdDialog.formData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID" prop="userData.id">
              <el-input
                v-model="chgpwdDialog.formData.userData.id"
                placeholder="用户ID"
                style="width: 90%"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户名" prop="userData.userName">
              <el-input
                v-model="chgpwdDialog.formData.userData.userName"
                readonly
                placeholder="用户名"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="chgpwdDialog.formData.oldPassword"
                placeholder="原密码"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="新密码"
              prop="password"
              :rules="[{required:true, message:'新密码', trigger:'blur'}]"
            >
              <el-input
                v-model="chgpwdDialog.formData.password"
                placeholder="新密码"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button @click="closeChgpwdDialog">关闭</el-button>
        <el-button type="primary" @click="confirmChgpwdDialog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import XEAjax from "xe-ajax";
import { list, create, update, del, chgpassword } from "@/api/uaaUser";
import { directResp, addDirectResp, delDirectResp } from "@/api/user";
import { deleteEmptyProperty } from "@/utils/util";
import XEUtils from "xe-utils";
import RespSelect from "@/components/RespSelect";

export default {
  components: { RespSelect },
  data() {
    return {
      propertyFilter: {
        userName: "",
        email: "",
        id: ""
      },
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {
          name: { familyName: "", givenName: "" },
          phoneNumbers: [{ value: "" }],
          emails: [{ value: "", primary: false }]
        }
      },
      viewTreeDialog: {
        title: "用户权限与授权",
        visible: false,
        viewOnly: false,
        formData: {},
        userGroup: {
          tableColumn: [
            { type: "index", width: 50 },
            { field: "value", title: "ID" },
            { field: "display", title: "名称" },
            { field: "type", title: "类型" }
          ]
        },
        userApprovals: {
          tableColumn: [
            { type: "index", width: 50 },
            { field: "clientId", title: "客户端ID" },
            { field: "scope", title: "授权范围" },
            { field: "status", title: "状态" },
            {
              field: "lastUpdatedAt",
              title: "最后更新时间",
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
              field: "expiresAt",
              title: "过期时间",
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
        }
      },
      userRespDialog: {
        title: "用户职责",
        visible: false,
        viewOnly: false,
        formData: {},
        userDirectResp: {
          validRules: {
            RESPONSIBILITY_KEY: [
              { required: true, message: "请选择职责", trigger: "blur" }
            ]
          },
          tableProxy: {
            index: false,
            sort: false, // 启用排序代理
            filter: false, // 启用筛选代理
            props: {
              result: "list",
              total: "total"
            },
            ajax: {
              query: ({ page, sort, filters }) => {
                if (this.userRespDialog.formData.id) {
                  return new Promise((resolve, reject) => {
                    directResp(this.userRespDialog.formData.id)
                      .then(res => {
                        resolve(res.data.list);
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
                return new Promise((resolve, reject) => {
                  delDirectResp(
                    this.userRespDialog.formData.id,
                    body
                  )
                    .then(res => {
                      this.$message.success("删除成功!");
                      resolve();
                    })
                    .catch(err => {
                      this.$message.error(err.data);
                      reject();
                    });
                });
              },
              save: ({ body }) => {
                return new Promise((resolve, reject) => {
                  addDirectResp(
                    this.userRespDialog.formData.id,
                    body
                  )
                    .then(res => {
                      this.$message.success("保存成功!");
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
          tableToolbar: {
            id: "user_directresp_1",
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
          customColumns: [],
          tableColumn: [
            { type: "selection", width: 50 },
            { type: "index", width: 50 },
            {
              field: "RESPONSIBILITY_KEY",
              title: "职责代码",
              editRender: { name: "input" }
            },
            {
              field: "RESPONSIBILITY_NAME",
              title: "职责名称"
            }
          ]
        }
      },
      chgpwdDialog: {
        title: "修改用户密码",
        visible: false,
        viewOnly: false,
        formData: {
          userData: {},
          oldPassword: "",
          password: ""
        }
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
        id: "user_edit_1",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "viewTree", name: "查看权限与授权" },
          { code: "userResp", name: "用户职责" },
          { code: "chgpwd", name: "修改密码" }
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
        { type: "selection", width: 50 },
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
    addNewForm() {
      this.editDialog.formData = {
        name: { familyName: "", givenName: "" },
        phoneNumbers: [{ value: "" }],
        emails: [{ value: "", primary: false }]
      };
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

      if (!row.phoneNumbers || row.phoneNumbers === 0) {
        this.$set(this.editDialog.formData, "phoneNumbers", [{ value: "" }]);
      }
      this.editDialog.visible = true;
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
        case "chgpwd":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.chgpwdDialog.visible = true;
          this.chgpwdDialog.formData.userData = rows[0];
          break;
        case "userResp":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.userRespDialog.visible = true;
          this.userRespDialog.formData = rows[0];
          if (this.$refs.userDirectRespGrid) {
            this.$refs.userDirectRespGrid.commitProxy("query");
          }
          break;
      }
    },
    closeViewTreeDialog() {
      this.viewTreeDialog.visible = false;
      this.viewTreeDialog.formData = {};
    },
    closeUserRespDialog() {
      this.userRespDialog.visible = false;
      this.userRespDialog.formData = {};
    },
    closeChgpwdDialog() {
      this.chgpwdDialog.visible = false;
      this.chgpwdDialog.formData.userData = {};
      this.chgpwdDialog.formData.oldPassword = "";
      this.chgpwdDialog.formData.password = "";
    },
    confirmChgpwdDialog() {
      const theThis = this;
      this.$refs.chgpwdForm.validate(function(valid) {
        if (!valid) {
          return;
        }
        if (
          theThis.chgpwdDialog.formData.userData.id &&
          theThis.chgpwdDialog.formData.password
        ) {
          chgpassword(
            theThis.chgpwdDialog.formData.userData.id,
            theThis.chgpwdDialog.formData.oldPassword,
            theThis.chgpwdDialog.formData.password
          )
            .then(res => {
              theThis.$message.success("修改成功!");
              theThis.closeChgpwdDialog();
            })
            .catch(err => {
              console.log(err);
              theThis.$message.error(err.message);
            });
        }
      });
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
    editUDREnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (column.property === "RESPONSIBILITY_KEY") {
        this.$refs.rSelect.showRespSelect(row);
      }
    },
    editUDREnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {},
    respSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.RESPONSIBILITY_KEY = e.RESPONSIBILITY_KEY;
          currentRow.RESPONSIBILITY_NAME = e.RESPONSIBILITY_NAME;
        }
        this.$refs.rSelect.hideRespSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    respSelectCancel(e) {
      this.$refs.rSelect.hideRespSelect();
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
.tab-container {
  margin: 30px;
}
</style>
