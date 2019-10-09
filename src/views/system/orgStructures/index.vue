<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="filterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="结构名称" prop="NAME.$instr">
            <el-input v-model="propertyFilter.NAME.$instr" clearable placeholder="结构名称" />
          </el-form-item>
          <el-form-item label="描述" prop="COMMENTS.$instr">
            <el-input v-model="propertyFilter.COMMENTS.$instr" clearable placeholder="描述" />
          </el-form-item>
          <el-form-item label="主要结构标识" prop="PRIMARY_STRUCTURE_FLAG">
            <el-select v-model="propertyFilter.PRIMARY_STRUCTURE_FLAG" clearable>
              <el-option
                v-for="item in primarySFlag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
      row-id="ORGANIZATION_STRUCTURE_ID"
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
    >
      <el-form ref="editForm" label-width="20%" :model="editDialog.formData">
        <el-form-item label="组织层级结构ID" prop="ORGANIZATION_STRUCTURE_ID">
          <el-input
            v-model="editDialog.formData.ORGANIZATION_STRUCTURE_ID"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="组织层级结构名称"
          prop="NAME"
          :rules="[{required:true, message:'请输入名称', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.NAME"
            clearable
            placeholder="组织层级结构名称"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="主要层级结构标识"
          prop="PRIMARY_STRUCTURE_FLAG"
          :rules="[{required:true, message:'请选择是否主要标识', trigger:'blur'}]"
        >
          <el-select
            v-model="editDialog.formData.PRIMARY_STRUCTURE_FLAG"
            clearable
            placeholder="请选择组织类型"
          >
            <el-option
              v-for="item in primarySFlag"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="VERSION_NUMBER" :rules="numberRule">
          <el-input
            v-model="editDialog.formData.VERSION_NUMBER"
            clearable
            placeholder="版本号"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="有效开始时间" prop="DATE_FROM">
          <el-date-picker
            v-model="editDialog.formData.DATE_FROM"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="有效结束时间" prop="DATE_TO">
          <el-date-picker
            v-model="editDialog.formData.DATE_TO"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item label="描述" prop="COMMENTS">
          <el-input
            v-model="editDialog.formData.COMMENTS"
            type="textarea"
            :rows="4"
            clearable
            placeholder="描述"
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
      <el-form ref="viewTreeForm" label-width="30%" :model="viewTreeDialog.formData">

        <el-form-item label="组织层级结构ID" prop="orgStructData.ORGANIZATION_STRUCTURE_ID" hidden>
          <el-input
            v-model="viewTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID"
            readonly
            hidden
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织层级结构名称" prop="orgStructData.NAME">
              <el-input
                v-model="viewTreeDialog.formData.orgStructData.NAME"
                readonly
                placeholder="组织层级结构名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要层级结构标识" prop="orgStructData.PRIMARY_STRUCTURE_FLAG">
              <el-select
                v-model="viewTreeDialog.formData.orgStructData.PRIMARY_STRUCTURE_FLAG"
                placeholder="请选择组织类型"
              >
                <el-option
                  v-for="item in primarySFlag"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
      top="5vh"
    >
      <el-form ref="editTreeForm" label-width="30%" :model="editTreeDialog.formData">
        <el-form-item label="组织层级结构ID" prop="orgStructData.ORGANIZATION_STRUCTURE_ID" hidden>
          <el-input
            v-model="editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID"
            readonly
            hidden
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织层级结构名称" prop="orgStructData.NAME">
              <el-input
                v-model="editTreeDialog.formData.orgStructData.NAME"
                readonly
                placeholder="组织层级结构名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要层级结构标识" prop="orgStructData.PRIMARY_STRUCTURE_FLAG">
              <el-select
                v-model="editTreeDialog.formData.orgStructData.PRIMARY_STRUCTURE_FLAG"
                placeholder="请选择组织类型"
              >
                <el-option
                  v-for="item in primarySFlag"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-card header="组织">
          <el-row>
            <el-col :span="10">
              <el-form-item label="上级组织名称" prop="orgTopData.ORGANIZATION_NAME_CHILD">
                <el-input v-model="editTreeDialog.formData.orgTopData.ORGANIZATION_NAME_CHILD" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="上级组织类型" prop="orgTopData.ORGANIZATION_TYPE_CHILD">
                <el-select v-model="editTreeDialog.formData.orgTopData.ORGANIZATION_TYPE_CHILD">
                  <el-option
                    v-for="item in orgType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label>
                <el-button type="primary" @click="goUp">向上<i class="el-icon-upload el-icon--right" /></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-card header="下级">
            <vxe-grid
              ref="xTreeGrid"
              border
              resizable
              highlight-hover-row
              remote-filter
              max-height="530"
              row-id="id"
              :customs.sync="elementEntry.customColumns"
              :pager-config="{pageSize: 10}"
              :toolbar="elementEntry.tableToolbar"
              :proxy-config="elementEntry.tableProxy"
              :columns="elementEntry.tableColumn"
              :select-config="{reserve: true}"
              :edit-rules="elementEntry.validRules"
              :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
              @cell-click="editElementEnrtyEvent"
              @edit-actived="editElementEnrtyActived"
            />
          </el-card>
        </el-card>
        <organization-select ref="orgSelect" @okClick="orgSelectOk" @cancelClick="orgSelectCancel" />
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
  listOrgElementInfo,
  listOrgTreeInfo,
  saveOrgElementInfo,
  delOrgElementInfo
} from "@/api/orgStructure";
import { deleteEmptyProperty } from "@/utils/util";
import OrganizationSelect from "@/components/OrganizationSelect";
import { listLookupValues } from "@/api/fndLookup";

export default {
  components: { OrganizationSelect },
  data() {
    return {
      propertyFilter: {
        NAME: { $instr: "" },
        PRIMARY_STRUCTURE_FLAG: "",
        COMMENTS: { $instr: "" }
      },
      numberRule: [
        { required: true, message: "版本号", trigger: "blur" },
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
      primarySFlag: [{ label: "是", value: "Y" }, { label: "否", value: "N" }],
      orgType: [],
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
      viewTreeDialog: {
        title: "组织结构查看器",
        visible: false,
        formData: {
          orgStructData: {},
          structreEleData: []
        },
        tableProxy: {
          index: false,
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: ({ page, sort, filters }) => {
              if (
                this.viewTreeDialog.formData.orgStructData &&
                this.viewTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  ORGANIZATION_STRUCTURE_ID: this.viewTreeDialog.formData.orgStructData
                    .ORGANIZATION_STRUCTURE_ID
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
                  listOrgTreeInfo({ jsonFilter, page })
                    .then(res => {
                      if (res.data.code !== "0") {
                        this.$message.error(res.data.message);
                        reject([]);
                      }
                      const treeData = this.$utils.toArrayTree(res.data.data, {
                        key: "ORGANIZATION_ID_CHILD",
                        parentKey: "ORGANIZATION_ID_PARENT",
                        children: "children"
                      });
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
          id: "eleEntry_view_1",
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
          { field: "ORG_STRUCTURE_ELEMENT_ID", visible: false },
          { field: "BUSINESS_GROUP_ID", visible: false },
          { field: "ORDER_RANK", visible: false },
          { field: "ORGANIZATION_ID_PARENT", visible: false },
          { field: "ORGANIZATION_NAME_PARENT", visible: false },
          { field: "ORGANIZATION_TYPE_PARENT", visible: false },
          { field: "ORGANIZATION_ID_CHILD", visible: false },
          { field: "ORG_STRUCTURE_ID", visible: false },
          { field: "ORG_STRUCTURE_VERSION_ID", visible: false },
          { field: "OBJECT_VERSION_NUMBER", visible: false },
          { field: "PARTY_ID", visible: false },
          { field: "POSITION_CONTROL_ENABLED_FLAG", visible: false },
          { field: "REQUEST_ID", visible: false },
          { field: "PROGRAM_APPLICATION_ID", visible: false },
          { field: "PROGRAM_ID", visible: false },
          { field: "PROGRAM_UPDATE_DATE", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "index", width: 60 },
          { field: "ORG_STRUCTURE_ELEMENT_ID", title: "组织层级结构元组ID", remoteSort: true },
          { field: "ORDER_RANK", title: "序号", remoteSort: true },
          { field: "ORGANIZATION_ID_PARENT", title: "上级组织ID", remoteSort: true },
          { field: "ORGANIZATION_NAME_PARENT", title: "上级组织名称", remoteSort: true },
          { field: "ORGANIZATION_TYPE_PARENT", title: "上级组织类型", remoteSort: true },
          { field: "ORGANIZATION_ID_CHILD", title: "下级组织ID", remoteSort: true },
          { field: "ORGANIZATION_NAME_CHILD", title: "组织名称", remoteSort: true, treeNode: true },
          { field: "ORGANIZATION_TYPE_CHILD", title: "组织类型", remoteSort: true, editRender: { name: 'ElSelect', options: [], props: { readonly: true, filterable: true }}},
          {
            field: "BUSINESS_GROUP_ID",
            title: "业务组ID",
            remoteSort: true
          },
          {
            field: "ORG_STRUCTURE_ID",
            title: "组织层级结构ID",
            remoteSort: true
          },
          { field: "ORG_STRUCTURE_VERSION_ID", title: "组织结构版本ID", remoteSort: true },
          {
            field: "OBJECT_VERSION_NUMBER",
            title: "对象版本号",
            remoteSort: true
          },
          {
            field: "PARTY_ID",
            title: "合作伙伴ID",
            remoteSort: true
          },
          {
            field: "POSITION_CONTROL_ENABLED_FLAG",
            title: "职位控制标识",
            remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "否", value: "N" },
                { label: "是", value: "Y" }
              ]
            }
          },
          { field: "REQUEST_ID", title: "请求ID", remoteSort: true },
          { field: "PROGRAM_APPLICATION_ID", title: "程序所属应用ID", remoteSort: true },
          { field: "PROGRAM_ID", title: "程序ID", remoteSort: true },
          { field: "PROGRAM_UPDATE_DATE", title: "程序更新时间", remoteSort: true },
          { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
          { field: "CREATED_BY", title: "创建人", remoteSort: true },
          { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
          { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
        ]
      },
      editTreeDialog: {
        title: "组织层级结构",
        visible: false,
        viewOnly: false,
        formData: {
          orgStructData: {},
          orgTopData: {},
          structreEleData: []
        }
      },
      elementEntry: {
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
                this.editTreeDialog.formData.orgStructData &&
                this.editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  ORG_STRUCTURE_ID: this.editTreeDialog.formData.orgStructData
                    .ORGANIZATION_STRUCTURE_ID
                };

                if (this.editTreeDialog.formData.orgTopData &&
                this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD) {
                  jsonFilter['ORGANIZATION_ID_PARENT'] = this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD;
                } else {
                  jsonFilter['ORGANIZATION_ID_PARENT'] = { "$null": "true" };
                }

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
                  listOrgElementInfo({ jsonFilter, page })
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
                delOrgElementInfo({
                  orgStructData: this.editTreeDialog.formData.orgStructData,
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
                saveOrgElementInfo({
                  orgStructData: this.editTreeDialog.formData.orgStructData,
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
          id: "elementEntry_edit_1",
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
          ORDER_RANK: [
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
          ORGANIZATION_ID_CHILD: [
            { required: true, message: "请选择下级组织", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "ORG_STRUCTURE_ELEMENT_ID", visible: false },
          { field: "BUSINESS_GROUP_ID", visible: false },
          { field: "ORG_STRUCTURE_ID", visible: false },
          { field: "ORGANIZATION_ID_PARENT", visible: false },
          { field: "ORGANIZATION_NAME_PARENT", visible: false },
          { field: "ORGANIZATION_TYPE_PARENT", visible: false },
          { field: "ORG_STRUCTURE_VERSION_ID", visible: false },
          { field: "OBJECT_VERSION_NUMBER", visible: false },
          { field: "PARTY_ID", visible: false },
          { field: "POSITION_CONTROL_ENABLED_FLAG", visible: false },
          { field: "REQUEST_ID", visible: false },
          { field: "PROGRAM_APPLICATION_ID", visible: false },
          { field: "PROGRAM_ID", visible: false },
          { field: "PROGRAM_UPDATE_DATE", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "selection", width: 50 },
          { type: "index", width: 60 },
          { field: "ORG_STRUCTURE_ELEMENT_ID", title: "组织层级结构元组ID", remoteSort: true },
          { field: "ORDER_RANK", title: "序号", remoteSort: true, editRender: { name: "input" }},
          { field: "ORGANIZATION_ID_PARENT", title: "上级组织ID", remoteSort: true },
          { field: "ORGANIZATION_NAME_PARENT", title: "上级组织名称", remoteSort: true },
          { field: "ORGANIZATION_TYPE_PARENT", title: "上级组织类型", remoteSort: true },
          { field: "ORGANIZATION_ID_CHILD", title: "下级组织ID", remoteSort: true, editRender: { name: "input" }},
          { field: "ORGANIZATION_NAME_CHILD", title: "下级组织名称", remoteSort: true },
          { field: "ORGANIZATION_TYPE_CHILD", title: "下级组织类型", remoteSort: true, editRender: { name: 'ElSelect', options: [], props: { readonly: true, filterable: true }}},
          { field: "OPERATION", title: "操作", remoteSort: true,
            slots: {
              default: ({ row, column }) => {
                if (row.ORG_STRUCTURE_ELEMENT_ID) {
                  return [
                    <el-button type='primary' onClick={ () => this.goDown(row) } >向下<i class='el-icon-download el-icon--right'></i></el-button>
                  ]
                } else {
                  return []
                }
              }
            }
          },
          {
            field: "BUSINESS_GROUP_ID",
            title: "业务组ID",
            remoteSort: true
          },
          {
            field: "ORG_STRUCTURE_ID",
            title: "组织层级结构ID",
            remoteSort: true
          },
          { field: "ORG_STRUCTURE_VERSION_ID", title: "组织结构版本ID", remoteSort: true },
          {
            field: "OBJECT_VERSION_NUMBER",
            title: "对象版本号",
            remoteSort: true
          },
          {
            field: "PARTY_ID",
            title: "合作伙伴ID",
            remoteSort: true
          },
          {
            field: "POSITION_CONTROL_ENABLED_FLAG",
            title: "职位控制标识",
            remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "否", value: "N" },
                { label: "是", value: "Y" }
              ]
            }
          },
          { field: "REQUEST_ID", title: "请求ID", remoteSort: true },
          { field: "PROGRAM_APPLICATION_ID", title: "程序所属应用ID", remoteSort: true },
          { field: "PROGRAM_ID", title: "程序ID", remoteSort: true },
          { field: "PROGRAM_UPDATE_DATE", title: "程序更新时间", remoteSort: true },
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
        id: "orgStruct_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "viewTree", name: "查看组织层级结构" },
          { code: "editTree", name: "编辑组织层级结构" }
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
        { field: "ORGANIZATION_STRUCTURE_ID", visible: false },
        { field: "BUSINESS_GROUP_ID", visible: false },
        { field: "POSITION_CONTROL_STRUCTURE_FLG", visible: false },
        { field: "REQUEST_ID", visible: false },
        { field: "PROGRAM_APPLICATION_ID", visible: false },
        { field: "PROGRAM_ID", visible: false },
        { field: "PROGRAM_UPDATE_DATE", visible: false },
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
        { field: "ATTRIBUTE16", visible: false },
        { field: "ATTRIBUTE17", visible: false },
        { field: "ATTRIBUTE18", visible: false },
        { field: "ATTRIBUTE19", visible: false },
        { field: "ATTRIBUTE20", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        {
          field: "ORGANIZATION_STRUCTURE_ID",
          title: "组织层级结构ID",
          remoteSort: true
        },
        { field: "BUSINESS_GROUP_ID", title: "业务组ID", remoteSort: true },
        { field: "NAME", title: "组织层级结构名称", remoteSort: true },
        {
          field: "PRIMARY_STRUCTURE_FLAG",
          title: "主要层级结构标识",
          remoteSort: true,
          editRender: {
            name: "select",
            options: [{ label: "是", value: "Y" }, { label: "否", value: "N" }]
          }
        },
        {
          field: "POSITION_CONTROL_STRUCTURE_FLG",
          title: "职位控制标识",
          remoteSort: true
        },
        { field: "VERSION_NUMBER", title: "版本号", remoteSort: true },
        { field: "DATE_FROM", title: "有效开始时间", remoteSort: true },
        { field: "DATE_TO", title: "有效结束时间", remoteSort: true },
        {
          field: "COMMENTS",
          title: "描述",
          showOverflow: true
        },
        { field: "REQUEST_ID", title: "请求ID", remoteSort: true },
        {
          field: "PROGRAM_APPLICATION_ID",
          title: "程序所属应用ID",
          remoteSort: true
        },
        { field: "PROGRAM_ID", title: "程序ID", remoteSort: true },
        {
          field: "PROGRAM_UPDATE_DATE",
          title: "程序更新时间",
          remoteSort: true
        },
        {
          field: "ATTRIBUTE_CATEGORY",
          title: "弹性域属性目录",
          remoteSort: true
        },
        { field: "ATTRIBUTE1", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE2", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE3", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE4", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE5", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE6", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE7", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE8", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE9", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE10", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE11", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE12", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE13", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE14", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE15", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE16", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE17", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE18", title: "弹性域属性2", remoteSort: true },
        { field: "ATTRIBUTE19", title: "弹性域属性1", remoteSort: true },
        { field: "ATTRIBUTE20", title: "弹性域属性2", remoteSort: true },
        { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
        { field: "CREATED_BY", title: "创建人", remoteSort: true },
        { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
        { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
      ]
    };
  },
  created() {
    this.initOrgType();
  },
  methods: {
    initOrgType() {
      const jsonFilter = { LOOKUP_TYPE: "ORG_TYPE" };
      const page = { "total": 1000, "pageSize": 1000, "currentPage": 1 };

      listLookupValues({ jsonFilter, page })
        .then(res => {
          if (res.data.code !== "0") {
            this.$message.error(res.data.message);
          }
          if (res.data.data.list && res.data.data.list.length > 0) {
            const data = []
            for (let i = 0; i <= res.data.data.list.length - 1; i++) {
              data.push({ label: res.data.data.list[i].MEANING, value: res.data.data.list[i].LOOKUP_CODE });
            }
            this.elementEntry.tableColumn[9].editRender.options = data;
            this.viewTreeDialog.tableColumn[8].editRender.options = data;
            this.orgType = data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
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
      this.editTreeDialog.formData.orgStructData = {};
      this.editTreeDialog.formData.orgTopData = {};
    },
    closeViewTreeDialog() {
      this.viewTreeDialog.visible = false;
      this.viewTreeDialog.formData.orgStructData = {};
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
        case "viewTree":
          if (rows.length !== 1) {
            this.$message.info("请选择一项!");
            return;
          }
          this.viewTreeDialog.formData.orgStructData = rows[0];
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
          this.editTreeDialog.formData.orgStructData = rows[0];
          if (this.$refs.xTreeGrid) {
            this.$refs.xTreeGrid.commitProxy("query");
          }
          break;
      }
    },
    editElementEnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (!row.ORG_STRUCTURE_ID) {
        row.ORG_STRUCTURE_ID = this.editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID;
      }
      if (!row.ORGANIZATION_ID_PARENT && this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD) {
        row.ORGANIZATION_ID_PARENT = this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD;
      }
      if (column.property === "ORGANIZATION_ID_CHILD") {
        this.$refs.orgSelect.showOrgSelect(row);
      }
    },
    editElementEnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {
      if (!row.ORG_STRUCTURE_ID) {
        row.ORG_STRUCTURE_ID = this.editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID;
      }
      if (!row.ORGANIZATION_ID_PARENT && this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD) {
        row.ORGANIZATION_ID_PARENT = this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_CHILD;
      }
    },
    orgSelectOk(e, i) {
      if (e) {
        const currentRow = i;
        if (currentRow) {
          currentRow.ORGANIZATION_ID_CHILD = e.ORGANIZATION_ID;
          currentRow.ORGANIZATION_NAME_CHILD = e.NAME;
          currentRow.ORGANIZATION_TYPE_CHILD = e.TYPE;
        }
        this.$refs.orgSelect.hideOrgSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    orgSelectCancel(e) {
      this.$refs.orgSelect.hideOrgSelect();
    },
    goUp() {
      if (this.editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID && this.editTreeDialog.formData.orgTopData && this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_PARENT) {
        const jsonFilter = { ORG_STRUCTURE_ID: this.editTreeDialog.formData.orgStructData.ORGANIZATION_STRUCTURE_ID,
          ORGANIZATION_ID_CHILD: this.editTreeDialog.formData.orgTopData.ORGANIZATION_ID_PARENT
        };
        const page = { "total": 100, "pageSize": 100, "currentPage": 1 };
        listOrgElementInfo({ jsonFilter, page })
          .then(res => {
            if (res.data.code !== "0") {
              this.$message.error(res.data.message);
            }
            if (res.data.data && res.data.data.list.length > 0) {
              this.editTreeDialog.formData.orgTopData = res.data.data.list[0];
              this.$refs.xTreeGrid.commitProxy("query");
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    goDown(row) {
      this.editTreeDialog.formData.orgTopData = row;
      this.$refs.xTreeGrid.commitProxy("query");
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
