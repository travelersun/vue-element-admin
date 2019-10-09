<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="filterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="组织名称" prop="NAME.$instr">
            <el-input v-model="propertyFilter.NAME.$instr" clearable placeholder="组织名称" />
          </el-form-item>
          <el-form-item label="组织类型" prop="TYPE">
            <el-select v-model="propertyFilter.TYPE" filterable placeholder="请选择组织类型">
              <el-option
                v-for="item in orgType"
                :key="item.LOOKUP_CODE"
                :label="item.MEANING"
                :value="item.LOOKUP_CODE"
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
      class="vxe-table-element"
      :loading="loading"
      show-overflow
      show-header-overflow
      :customs.sync="customColumns"
      highlight-hover-row
      remote-filter
      align="center"
      max-height="650px"
      row-id="ORGANIZATION_ID"
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
      <el-form ref="editForm" label-width="15%" :model="editDialog.formData">
        <el-form-item label="组织ID" prop="ORGANIZATION_ID">
          <el-input
            v-model="editDialog.formData.ORGANIZATION_ID"
            placeholder="组织ID"
            readonly
          />
        </el-form-item>
        <el-form-item label="组织名称" prop="NAME" :rules="[{required:true,message:'请输入组织名称', trigger:'blur'}]">
          <el-input
            v-model="editDialog.formData.NAME"
            clearable
            placeholder="组织名称"
          />
        </el-form-item>
        <el-form-item
          label="组织类型"
          prop="TYPE"
        >
          <el-select v-model="editDialog.formData.TYPE" filterable placeholder="请选择组织类型">
            <el-option
              v-for="item in orgType"
              :key="item.LOOKUP_CODE"
              :label="item.MEANING"
              :value="item.LOOKUP_CODE"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址ID" prop="LOCATION_ID" :rules="numberRule">
          <el-input
            v-model="editDialog.formData.LOCATION_ID"
            placeholder="地址ID"
            @focus="selectLocation"
          />
        </el-form-item>
        <el-form-item
          label="地址名称"
          prop="LOCATION_CODE"
        >
          <el-input
            v-model="editDialog.formData.LOCATION_CODE"
            readonly
            placeholder="地址名称"
          />
        </el-form-item>
        <el-form-item
          label="地址详情"
          prop="ADDRESS_LINE_1"
        >
          <el-input
            v-model="editDialog.formData.ADDRESS_LINE_1"
            readonly
            placeholder="地址详情"
          />
        </el-form-item>
        <el-form-item
          label="启用时间"
          prop="DATE_FROM"
        >
          <el-date-picker
            v-model="editDialog.formData.DATE_FROM"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item
          label="过期时间"
          prop="DATE_TO"
        >
          <el-date-picker
            v-model="editDialog.formData.DATE_TO"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item
          label="内外部标识"
          prop="INTERNAL_EXTERNAL_FLAG"
        >
          <el-select v-model="editDialog.formData.INTERNAL_EXTERNAL_FLAG" placeholder="内外部标识">
            <el-option value="INTERNAL" label="内部" />
            <el-option value="EXTERNAL" label="外部" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="COMMENTS"
        >
          <el-input
            v-model="editDialog.formData.COMMENTS"
            type="textarea"
            :rows="4"
            clearable
            placeholder="备注"
          />
        </el-form-item>

        <location-select ref="locationSelect" @okClick="locationSelectOk" @cancelClick="locationSelectCancel" />
      </el-form>
      <div slot="footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editTreeDialog.visible"
      :title="editTreeDialog.title"
      width="50%"
      :before-close="closeEditTreeDialog"
      top="5vh"
    >
      <el-form ref="editTreeForm" label-width="20%" :model="editTreeDialog.formData">
        <el-form-item label="组织ID" prop="orgData.ORGANIZATION_ID">
          <el-input
            v-model="editTreeDialog.formData.orgData.ORGANIZATION_ID"
            placeholder="组织ID"
            readonly
          />
        </el-form-item>
        <el-form-item label="组织名称" prop="orgData.NAME">
          <el-input
            v-model="editTreeDialog.formData.orgData.NAME"
            readonly
            placeholder="组织名称"
          />
        </el-form-item>
        <el-form-item
          label="组织类型"
          prop="orgData.TYPE"
        >
          <el-select v-model="editTreeDialog.formData.orgData.TYPE" filterable placeholder="请选择组织类型">
            <el-option
              v-for="item in orgType"
              :key="item.LOOKUP_CODE"
              :label="item.MEANING"
              :value="item.LOOKUP_CODE"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="内外部标识"
          prop="orgData.INTERNAL_EXTERNAL_FLAG"
        >
          <el-select v-model="editTreeDialog.formData.orgData.INTERNAL_EXTERNAL_FLAG" placeholder="内外部标识">
            <el-option value="INTERNAL" label="内部" />
            <el-option value="EXTERNAL" label="外部" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="orgData.COMMENTS"
        >
          <el-input
            v-model="editTreeDialog.formData.orgData.COMMENTS"
            type="textarea"
            :rows="4"
            readonly
            placeholder="备注"
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
          :customs.sync="infoEntry.customColumns"
          :pager-config="{pageSize: 10}"
          :toolbar="infoEntry.tableToolbar"
          :proxy-config="infoEntry.tableProxy"
          :columns="infoEntry.tableColumn"
          :select-config="{reserve: true}"
          :edit-rules="infoEntry.validRules"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          @cell-click="editInfoEnrtyEvent"
          @edit-actived="editInfoEnrtyActived"
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
  list,
  save,
  del,
  listOrgInfo,
  saveOrgInfo,
  delOrgInfo
} from "@/api/organization";
import { deleteEmptyProperty } from "@/utils/util";
import { listLookupValues } from "@/api/fndLookup";
import LocationSelect from "@/components/LocationSelect";

export default {
  components: { LocationSelect },
  data() {
    return {
      propertyFilter: {
        NAME: { $instr: "" },
        LOOKUP_TYPE: ""
      },
      numberRule: [
        { required: false, message: "请输入", trigger: "blur" },
        {
          validator(rule, value, callback) {
            if (value && Number.isInteger(Number(value))) {
              callback();
            } else if (!value) {
              callback();
            } else {
              callback(new Error("请输入整数"));
            }
          },
          trigger: "blur"
        }
      ],
      loading: false,
      orgType: [],
      orgClass: [],
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
      editTreeDialog: {
        title: "组织分类列表",
        visible: false,
        viewOnly: false,
        formData: {
          orgData: {},
          orgInfoData: []
        }
      },
      infoEntry: {
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
                this.editTreeDialog.formData.orgData &&
                this.editTreeDialog.formData.orgData.ORGANIZATION_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  ORGANIZATION_ID: this.editTreeDialog.formData.orgData.ORGANIZATION_ID,
                  ORG_INFORMATION_CONTEXT: "ORG_CLASS"
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
                  listOrgInfo({ jsonFilter, page })
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
                delOrgInfo({
                  orgData: this.editTreeDialog.formData.orgData,
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
                saveOrgInfo({
                  orgData: this.editTreeDialog.formData.orgData,
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
          id: "infoEntry_edit_1",
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
          ORG_INFORMATION1: [
            { required: true, message: "请选择组织分类", trigger: "blur" }
          ],
          ORG_INFORMATION2: [
            { required: true, message: "请选择是否启用", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "ORG_INFORMATION_ID", visible: false },
          { field: "ORG_INFORMATION_CONTEXT", visible: false },
          { field: "ORGANIZATION_ID", visible: false },
          { field: "OBJECT_VERSION_NUMBER", visible: false },
          { field: "REQUEST_ID", visible: false },
          { field: "PROGRAM_APPLICATION_ID", visible: false },
          { field: "PROGRAM_ID", visible: false },
          { field: "PROGRAM_UPDATE_DATE", visible: false },
          { field: "PARTY_ID", visible: false },
          { field: "ORG_INFORMATION3", visible: false },
          { field: "ORG_INFORMATION4", visible: false },
          { field: "ORG_INFORMATION5", visible: false },
          { field: "ORG_INFORMATION6", visible: false },
          { field: "ORG_INFORMATION7", visible: false },
          { field: "ORG_INFORMATION8", visible: false },
          { field: "ORG_INFORMATION9", visible: false },
          { field: "ORG_INFORMATION10", visible: false },
          { field: "ORG_INFORMATION11", visible: false },
          { field: "ORG_INFORMATION12", visible: false },
          { field: "ORG_INFORMATION13", visible: false },
          { field: "ORG_INFORMATION14", visible: false },
          { field: "ORG_INFORMATION15", visible: false },
          { field: "ORG_INFORMATION16", visible: false },
          { field: "ORG_INFORMATION17", visible: false },
          { field: "ORG_INFORMATION18", visible: false },
          { field: "ORG_INFORMATION19", visible: false },
          { field: "ORG_INFORMATION20", visible: false },
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
          { field: "ORG_INFORMATION_ID", title: "组织附加信息ID", remoteSort: true },
          { field: "ORG_INFORMATION_CONTEXT", title: "组织附加信息上下文", remoteSort: true, editRender: { name: "input" }},
          { field: "ORGANIZATION_ID", title: "组织ID", remoteSort: true, editRender: { name: "input" }},
          { field: "ORG_INFORMATION1", title: "组织分类", remoteSort: true, editRender: { name: 'ElSelect', options: [], props: { filterable: true }}},
          { field: "ORG_INFORMATION2", title: "启用标识", remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "否", value: "N" },
                { label: "是", value: "Y" }
              ]
            }
          },
          { field: "OBJECT_VERSION_NUMBER", title: "对象版本号", remoteSort: true, editRender: { name: "input" }},
          { field: "REQUEST_ID", title: "请求ID", remoteSort: true },
          { field: "PROGRAM_APPLICATION_ID", title: "程序所属应用ID", remoteSort: true },
          { field: "PROGRAM_ID", title: "程序ID", remoteSort: true },
          { field: "PROGRAM_UPDATE_DATE", title: "程序更新时间", remoteSort: true },
          { field: "PARTY_ID", title: "合作伙伴ID", remoteSort: true },
          { field: "ORG_INFORMATION3", title: "组织信息3", remoteSort: true },
          { field: "ORG_INFORMATION4", title: "组织信息4", remoteSort: true },
          { field: "ORG_INFORMATION5", title: "组织信息5", remoteSort: true },
          { field: "ORG_INFORMATION6", title: "组织信息6", remoteSort: true },
          { field: "ORG_INFORMATION7", title: "组织信息7", remoteSort: true },
          { field: "ORG_INFORMATION8", title: "组织信息8", remoteSort: true },
          { field: "ORG_INFORMATION9", title: "组织信息9", remoteSort: true },
          { field: "ORG_INFORMATION10", title: "组织信息10", remoteSort: true },
          { field: "ORG_INFORMATION11", title: "组织信息11", remoteSort: true },
          { field: "ORG_INFORMATION12", title: "组织信息12", remoteSort: true },
          { field: "ORG_INFORMATION13", title: "组织信息13", remoteSort: true },
          { field: "ORG_INFORMATION14", title: "组织信息14", remoteSort: true },
          { field: "ORG_INFORMATION15", title: "组织信息15", remoteSort: true },
          { field: "ORG_INFORMATION16", title: "组织信息16", remoteSort: true },
          { field: "ORG_INFORMATION17", title: "组织信息17", remoteSort: true },
          { field: "ORG_INFORMATION18", title: "组织信息18", remoteSort: true },
          { field: "ORG_INFORMATION19", title: "组织信息19", remoteSort: true },
          { field: "ORG_INFORMATION20", title: "组织信息20", remoteSort: true },
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
          { field: "ATTRIBUTE16", title: "弹性域属性16", remoteSort: true },
          { field: "ATTRIBUTE17", title: "弹性域属性17", remoteSort: true },
          { field: "ATTRIBUTE18", title: "弹性域属性18", remoteSort: true },
          { field: "ATTRIBUTE19", title: "弹性域属性19", remoteSort: true },
          { field: "ATTRIBUTE20", title: "弹性域属性20", remoteSort: true },
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
        id: "org_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "editTree", name: "编辑组织分类列表" }
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
        { field: "ORGANIZATION_ID", visible: false },
        { field: "LOCATION_ID", visible: false },
        { field: "OBJECT_VERSION_NUMBER", visible: false },
        { field: "PARTY_ID", visible: false },
        { field: "REQUEST_ID", visible: false },
        { field: "PROGRAM_APPLICATION_ID", visible: false },
        { field: "PROGRAM_ID", visible: false },
        { field: "PROGRAM_UPDATE_DATE", visible: false },
        { field: "INTERNAL_ADDRESS_LINE", visible: false },
        { field: "BUSINESS_GROUP_ID", visible: false },
        { field: "COST_ALLOCATION_KEYFLEX_ID", visible: false },
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
        { field: "ATTRIBUTE21", visible: false },
        { field: "ATTRIBUTE22", visible: false },
        { field: "ATTRIBUTE23", visible: false },
        { field: "ATTRIBUTE24", visible: false },
        { field: "ATTRIBUTE25", visible: false },
        { field: "ATTRIBUTE26", visible: false },
        { field: "ATTRIBUTE27", visible: false },
        { field: "ATTRIBUTE28", visible: false },
        { field: "ATTRIBUTE29", visible: false },
        { field: "ATTRIBUTE30", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "ORGANIZATION_ID", title: "组织ID", remoteSort: true },
        { field: "NAME", title: "组织名称", remoteSort: true },
        { field: "LOCATION_ID", title: "地址ID", remoteSort: true },
        { field: "LOCATION_CODE", title: "地址名称", remoteSort: true },
        { field: "ADDRESS_LINE_1", title: "地址详情", remoteSort: true },
        { field: "DATE_FROM", title: "启用时间", remoteSort: true },
        { field: "DATE_TO", title: "过期时间", remoteSort: true },
        { field: "INTERNAL_EXTERNAL_FLAG", title: "内外部标识", remoteSort: true,
          filters: [
            { label: "内部", value: "INTERNAL" },
            { label: "外部", value: "EXTERNAL" }
          ],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [
              { label: "内部", value: "INTERNAL" },
              { label: "外部", value: "EXTERNAL" }
            ]
          }
        },
        { field: "TYPE", title: "组织类型", remoteSort: true,
          editRender: { name: 'ElSelect', options: [], props: { filterable: true }}
        },
        { field: "COMMENTS", title: "备注", remoteSort: true },
        { field: "OBJECT_VERSION_NUMBER", title: "对象版本号", remoteSort: true },
        { field: "PARTY_ID", title: "合作伙伴ID", remoteSort: true },
        { field: "REQUEST_ID", title: "请求ID", remoteSort: true },
        { field: "PROGRAM_APPLICATION_ID", title: "程序应用ID", remoteSort: true },
        { field: "PROGRAM_ID", title: "程序ID", remoteSort: true },
        { field: "PROGRAM_UPDATE_DATE", title: "程序更新时间", remoteSort: true },
        { field: "INTERNAL_ADDRESS_LINE", title: "内部地址", remoteSort: true },
        { field: "BUSINESS_GROUP_ID", title: "业务组ID", remoteSort: true, showOverflow: true },
        { field: "COST_ALLOCATION_KEYFLEX_ID", title: "成本分配弹性域ID", remoteSort: true },
        { field: "ATTRIBUTE_CATEGORY", title: "属性目录", remoteSort: true },
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
        { field: "ATTRIBUTE16", title: "弹性域属性16", remoteSort: true },
        { field: "ATTRIBUTE17", title: "弹性域属性17", remoteSort: true },
        { field: "ATTRIBUTE18", title: "弹性域属性18", remoteSort: true },
        { field: "ATTRIBUTE19", title: "弹性域属性19", remoteSort: true },
        { field: "ATTRIBUTE20", title: "弹性域属性20", remoteSort: true },
        { field: "ATTRIBUTE21", title: "弹性域属性21", remoteSort: true },
        { field: "ATTRIBUTE22", title: "弹性域属性22", remoteSort: true },
        { field: "ATTRIBUTE23", title: "弹性域属性23", remoteSort: true },
        { field: "ATTRIBUTE24", title: "弹性域属性24", remoteSort: true },
        { field: "ATTRIBUTE25", title: "弹性域属性25", remoteSort: true },
        { field: "ATTRIBUTE26", title: "弹性域属性26", remoteSort: true },
        { field: "ATTRIBUTE27", title: "弹性域属性27", remoteSort: true },
        { field: "ATTRIBUTE28", title: "弹性域属性28", remoteSort: true },
        { field: "ATTRIBUTE29", title: "弹性域属性29", remoteSort: true },
        { field: "ATTRIBUTE30", title: "弹性域属性30", remoteSort: true },
        { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
        { field: "CREATED_BY", title: "创建人", remoteSort: true },
        { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
        { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
      ]
    };
  },
  created() {
    this.loading = true;
    this.initOrgType();
    this.initOrgClass();
    this.loading = false
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
              this.orgType.push(res.data.data.list[i]);
            }
            this.tableColumn[10].editRender.options = data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    initOrgClass() {
      const jsonFilter = { LOOKUP_TYPE: "ORG_CLASS" };
      const page = { "total": 1000, "pageSize": 1000, "currentPage": 1 };

      listLookupValues({ jsonFilter, page })
        .then(res => {
          if (res.data.code !== "0") {
            this.$message.error(res.data.message);
          }
          if (res.data.data.list && res.data.data.list.length > 0) {
            const data = []
            for (let i = 0; i <= res.data.data.list.length - 1; i++) {
              this.orgClass.push(res.data.data.list[i]);
              data.push({ label: res.data.data.list[i].MEANING, value: res.data.data.list[i].LOOKUP_CODE });
            }
            this.infoEntry.tableColumn[5].editRender.options = data;
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
      this.editTreeDialog.formData.orgData = {};
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
          this.editTreeDialog.formData.orgData = rows[0];
          if (this.$refs.xTreeGrid) {
            this.$refs.xTreeGrid.commitProxy("query");
          }
          break;
      }
    },
    editInfoEnrtyEvent(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      if (!row.ORG_INFORMATION_CONTEXT) {
        row.ORG_INFORMATION_CONTEXT = "ORG_CLASS";
      }
      if (!row.ORGANIZATION_ID) {
        row.ORGANIZATION_ID = this.editTreeDialog.formData.orgData.ORGANIZATION_ID;
      }
    },
    editInfoEnrtyActived({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {
      if (!row.ORG_INFORMATION_CONTEXT) {
        row.ORG_INFORMATION_CONTEXT = "ORG_CLASS";
      }
      if (!row.ORGANIZATION_ID) {
        row.ORGANIZATION_ID = this.editTreeDialog.formData.orgData.ORGANIZATION_ID;
      }
    },
    selectLocation(e) {
      this.$refs.locationSelect.showLocationSelect();
    },
    locationSelectOk(e, i) {
      if (e) {
        this.$set(this.editDialog.formData, "LOCATION_ID", e.LOCATION_ID);
        this.$set(this.editDialog.formData, "LOCATION_CODE", e.LOCATION_CODE);
        this.$set(
          this.editDialog.formData,
          "ADDRESS_LINE_1",
          e.ADDRESS_LINE_1
        );
        this.$refs.locationSelect.hideLocationSelect();
      } else {
        this.$message.info("请选择一项!");
      }
    },
    locationSelectCancel(e) {
      this.$refs.locationSelect.hideLocationSelect();
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
