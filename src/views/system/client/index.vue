<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="客户端ID" prop="client_id">
            <el-input v-model="propertyFilter.client_id" clearable placeholder="客户端ID" />
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
      row-id="client_id"
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
      width="60%"
      top="5vh"
    >
      <el-form ref="editForm" label-width="20%" :model="editDialog.formData">
        <el-form-item
          label="客户端ID"
          prop="client_id"
          :rules="[{required:true, message:'客户端ID', trigger:'blur'}]"
        >
          <el-input v-model="editDialog.formData.client_id" placeholder="客户端ID" style="width: 90%" />
        </el-form-item>
        <el-form-item
          label="客户端名称"
          prop="name"
          :rules="[{required:true, message:'客户端名称', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.name"
            clearable
            placeholder="客户端名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          v-if="!editDialog.formData.lastModified"
          label="客户端密码"
          prop="client_secret"
          :rules="[{required:true, message:'客户端密码', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.client_secret"
            clearable
            placeholder="客户端密码"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="授权类型" prop="authorized_grant_types">
          <el-checkbox-group v-model="editDialog.formData.authorized_grant_types">
            <el-checkbox label="password" />
            <el-checkbox label="authorization_code" />
            <el-checkbox label="client_credentials" />
            <el-checkbox label="refresh_token" />
            <el-checkbox label="implicit" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="客户端重定向URL"
          prop="redirect_uri"
          :rules="[{required:true, message:'客户端重定向URL', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.redirect_uri"
            type="textarea"
            :rows="4"
            clearable
            placeholder="客户端重定向URL','分隔"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="自动审批" prop="autoapprove">
          <el-switch
            v-model="editDialog.formData.autoapprove"
            active-value="true"
            inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="客户端授权" prop="authorities">
          <el-transfer
            v-model="editDialog.formData.authorities"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入关键字"
            :titles="['Source', 'Target']"
            :data="groupData"
          />
        </el-form-item>
        <el-form-item label="客户端scope" prop="scope">
          <el-transfer
            v-model="editDialog.formData.scope"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入关键字"
            :titles="['Source', 'Target']"
            :data="groupData"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
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
            <el-form-item label="客户端ID" prop="clientData.client_id">
              <el-input
                v-model="chgpwdDialog.formData.clientData.client_id"
                placeholder="客户端ID"
                style="width: 90%"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户端名称" prop="clientData.name">
              <el-input
                v-model="chgpwdDialog.formData.clientData.name"
                readonly
                placeholder="客户端名称"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="原密码" prop="oldSecret">
              <el-input
                v-model="chgpwdDialog.formData.oldSecret"
                placeholder="原密码"
                style="width: 90%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="新密码" prop="secret" :rules="[{required:true, message:'新密码', trigger:'blur'}]">
              <el-input
                v-model="chgpwdDialog.formData.secret"
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
import { list, create, update, del, chgpassword } from "@/api/uaaClient";
import * as uaaGroup from "@/api/uaaGroup";
import { deleteEmptyProperty } from "@/utils/util";
import XEUtils from "xe-utils";

export default {
  data() {
    return {
      propertyFilter: {
        client_id: ""
      },
      groupData: [],
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
      chgpwdDialog: {
        title: "修改客户端密码",
        visible: false,
        viewOnly: false,
        formData: {
          clientData: {},
          oldSecret: "",
          secret: ""
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

            if (this.propertyFilter.client_id) {
              if (jsonFilter.filter) {
                jsonFilter.filter += `and client_id co "${this.propertyFilter.client_id}"`;
              } else {
                jsonFilter.filter += `client_id co "${this.propertyFilter.client_id}"`;
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
                del(removeRecords[i].client_id)
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
                del(removeRecords[0].client_id)
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
        id: "client_edit_1",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
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
      customColumns: [{ field: "token_salt", visible: false }],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "client_id", title: "客户端ID", remoteSort: true },
        { field: "authorized_grant_types", title: "授权类型" },
        { field: "redirect_uri", title: "重定向URL" },
        { field: "autoapprove", title: "自动审批", remoteSort: true },
        { field: "authorities", title: "客户端授权", remoteSort: true },
        { field: "scope", title: "客户端scope", remoteSort: true },
        { field: "token_salt", title: "令牌盐" },
        { field: "name", title: "客户端名称" },
        {
          field: "lastModified",
          title: "最后修改时间",
          remoteSort: true,
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
  created() {
    this.fetchGroupData();
  },
  methods: {
    filterMethod(query, item) {
      if (!query) {
        return true
      }
      if (item.key) {
        return item.key.indexOf(query) !== -1
      }
      return false;
    },
    fetchGroupData() {
      // 处理排序条件
      const jsonFilter = {
        filter: "",
        sortBy: "",
        sortOrder: "",
        startIndex: "",
        count: ""
      };

      jsonFilter.sortBy = "displayName";
      jsonFilter.sortOrder = "ascending";

      jsonFilter.startIndex = 1;
      jsonFilter.count = 10000;

      deleteEmptyProperty(jsonFilter);

      return new Promise((resolve, reject) => {
        uaaGroup
          .list(jsonFilter)
          .then(res => {
            if (res.data.resources && res.data.resources.length > 0) {
              for (let i = 0; i < res.data.resources.length; i++) {
                this.groupData.push({
                  label: res.data.resources[i].displayName,
                  key: res.data.resources[i].displayName
                });
              }
            }
            resolve(res.data);
          })
          .catch(err => {
            this.$message.error(err.message);
            reject(err.data);
          });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchForm(formName) {
      this.$refs.xGrid.commitProxy("query");
    },
    addNewForm() {
      this.editDialog.formData = {
        authorized_grant_types: [],
        scope: [],
        redirect_uri: "",
        authorities: []
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
      if (!row.authorized_grant_types) {
        row.authorized_grant_types = []
      }
      if (!row.scope) {
        row.scope = []
      }
      if (!row.redirect_uri) {
        row.redirect_uri = ""
      }
      if (row.redirect_uri) {
        row.redirect_uri = row.redirect_uri.join(",")
      }
      if (!row.authorities) {
        row.authorities = []
      }
      if (!row.autoapprove || row.autoapprove.length === 0) {
        row.autoapprove = "false";
      } else if (row.autoapprove && row.autoapprove.length > 0) {
        row.autoapprove = "true"
      }

      this.editDialog.formData = row;

      this.editDialog.visible = true;
    },
    toolbarButtonClickEvent({ button }, event) {
      const rows = this.$refs.xGrid.getSelectRecords();
      switch (button.code) {
        case "chgpwd":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.chgpwdDialog.visible = true;
          this.chgpwdDialog.formData.clientData = rows[0];
          break;
      }
    },
    closeChgpwdDialog() {
      this.chgpwdDialog.visible = false;
      this.chgpwdDialog.formData.clientData = {};
      this.chgpwdDialog.formData.oldSecret = "";
      this.chgpwdDialog.formData.secret = "";
    },
    confirmChgpwdDialog() {
      const theThis = this;
      this.$refs.chgpwdForm.validate(function(valid) {
        if (!valid) {
          return;
        }
        if (theThis.chgpwdDialog.formData.clientData.client_id && theThis.chgpwdDialog.formData.secret) {
          chgpassword(theThis.chgpwdDialog.formData.clientData.client_id, theThis.chgpwdDialog.formData.oldSecret, theThis.chgpwdDialog.formData.secret)
            .then(res => {
              theThis.$message.success("修改成功!");
              theThis.closeChgpwdDialog();
            })
            .catch(err => {
              console.log(err)
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
        if (!theThis.editDialog.formData.lastModified) {
          create(theThis.editDialog.formData)
            .then(res => {
              theThis.$message.success("创建成功!");
              theThis.closeEditDialog();
            })
            .catch(err => {
              theThis.$message.error(err.message);
            });
        } else {
          update(theThis.editDialog.formData.client_id, theThis.editDialog.formData)
            .then(res => {
              theThis.$message.success("修改成功!");
              theThis.closeEditDialog();
            })
            .catch(err => {
              theThis.$message.error(err.message);
            });
        }
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
