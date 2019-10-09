<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="filterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="主要标识" prop="PRIMARY_KEY.$instr">
            <el-input v-model="propertyFilter.PRIMARY_KEY.$instr" clearable placeholder="主要标识" />
          </el-form-item>
          <el-form-item label="主要数据" prop="PRIMARY_VALUE.$instr">
            <el-input v-model="propertyFilter.PRIMARY_VALUE.$instr" clearable placeholder="主要数据" />
          </el-form-item>
          <el-form-item label="次要标识" prop="SECONDARY_KEY.$instr">
            <el-input v-model="propertyFilter.SECONDARY_KEY.$instr" clearable placeholder="次要标识" />
          </el-form-item>
          <el-form-item label="次要数据" prop="SECONDARY_VALUE.$instr">
            <el-input v-model="propertyFilter.SECONDARY_VALUE.$instr" clearable placeholder="次要数据" />
          </el-form-item>
          <el-form-item label="父字典标识" prop="PARANT_DATA_DICT_ID">
            <el-input v-model="propertyFilter.PARANT_DATA_DICT_ID" clearable placeholder="父字典标识" />
          </el-form-item>
          <el-form-item label="是否只包含顶级字典" prop="PARANT_DATA_DICT_ID_ISNULL">
            <el-checkbox v-model="propertyFilter.PARANT_DATA_DICT_ID_ISNULL">是</el-checkbox>
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
      row-id="FND_DATA_DICT_ID"
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
        <el-form-item label="字典标识" prop="FND_DATA_DICT_ID">
          <el-input
            v-model="editDialog.formData.FND_DATA_DICT_ID"
            clearable
            placeholder="字典标识"
            style="width: 90%"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="主标识"
          prop="PRIMARY_KEY"
          :rules="[{required:true, message:'主标识', trigger:'blur'}]"
        >
          <el-input
            v-model="editDialog.formData.PRIMARY_KEY"
            clearable
            placeholder="主标识"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="主要数据"
          prop="PRIMARY_VALUE"
        >
          <el-input
            v-model="editDialog.formData.PRIMARY_VALUE"
            clearable
            placeholder="主要数据"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="次标识"
          prop="SECONDARY_KEY"
        >
          <el-input
            v-model="editDialog.formData.SECONDARY_KEY"
            clearable
            placeholder="次标识"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="次要数据"
          prop="SECONDARY_VALUE"
        >
          <el-input
            v-model="editDialog.formData.SECONDARY_VALUE"
            clearable
            placeholder="次要数据"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="是否禁用"
          prop="DISABLE"
          :rules="[{required:true,message:'请选择是否禁用', trigger:'blur'}]"
        >
          <el-select v-model="editDialog.formData.DISABLE" placeholder="是否禁用" style="width: 90%">
            <el-option value="0" label="否" />
            <el-option value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="ORDER_RANK"
          :rules="numberRule"
        >
          <el-input
            v-model="editDialog.formData.ORDER_RANK"
            clearable
            placeholder="请输入排序号"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="文件路径数据"
          prop="FILE_PATH_VALUE"
        >
          <el-input
            v-model="editDialog.formData.FILE_PATH_VALUE"
            clearable
            placeholder="请输入文件路径数据"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item
          label="图片路径数据"
          prop="IMAGE_PATH_VALUE"
        >
          <el-input
            v-model="editDialog.formData.IMAGE_PATH_VALUE"
            clearable
            placeholder="请输入图片路径数据"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="富文本属性值" prop="RICH_TEXT_VALUE">
          <el-input
            v-model="editDialog.formData.RICH_TEXT_VALUE"
            type="textarea"
            clearable
            placeholder="富文本属性值"
            style="width: 90%"
          />
        </el-form-item>
        <el-form-item label="父字典标识" prop="PARANT_DATA_DICT_ID">
          <el-input
            v-model="editDialog.formData.PARANT_DATA_DICT_ID"
            clearable
            readonly
            placeholder="父字典标识"
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
            <el-form-item label="父字典标识" prop="dictData.FND_DATA_DICT_ID" hidden>
              <el-input
                v-model="viewTreeDialog.formData.dictData.FND_DATA_DICT_ID"
                clearable
                readonly
                hidden
              />
            </el-form-item>
            <el-form-item label="主标识" prop="dictData.PRIMARY_KEY">
              <el-input v-model="viewTreeDialog.formData.dictData.PRIMARY_KEY" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="主要数据" prop="dictData.PRIMARY_VALUE">
              <el-input v-model="viewTreeDialog.formData.dictData.PRIMARY_VALUE" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="次标识" prop="dictData.SECONDARY_KEY">
              <el-input v-model="viewTreeDialog.formData.dictData.SECONDARY_KEY" readonly="" />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="次要数据" prop="dictData.SECONDARY_VALUE">
              <el-input v-model="viewTreeDialog.formData.dictData.SECONDARY_VALUE" readonly />
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
          row-id="FND_DATA_DICT_ID"
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
            <el-form-item label="字典标识" prop="dictData.FND_DATA_DICT_ID" hidden>
              <el-input
                v-model="editTreeDialog.formData.dictData.FND_DATA_DICT_ID"
                readonly
                hidden
              />
            </el-form-item>
            <el-form-item label="主标识" prop="dictData.PRIMARY_KEY">
              <el-input v-model="editTreeDialog.formData.dictData.PRIMARY_KEY" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="主要数据" prop="dictData.PRIMARY_VALUE">
              <el-input v-model="editTreeDialog.formData.dictData.PRIMARY_VALUE" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="次标识" prop="dictData.SECONDARY_KEY">
              <el-input v-model="editTreeDialog.formData.dictData.SECONDARY_KEY" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="次要数据" prop="dictData.SECONDARY_VALUE">
              <el-input v-model="editTreeDialog.formData.dictData.SECONDARY_VALUE" readonly />
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
          :customs.sync="dictEntry.customColumns"
          :pager-config="{pageSize: 10}"
          :toolbar="dictEntry.tableToolbar"
          :proxy-config="dictEntry.tableProxy"
          :columns="dictEntry.tableColumn"
          :select-config="{reserve: true}"
          :edit-rules="dictEntry.validRules"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          @cell-click="editMenuEnrtyEvent"
          @edit-actived="editMenuEnrtyActived"
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
  listDictEntry,
  saveDictEntry,
  delDictEntry,
  listDictTree
} from "@/api/dataDict";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  data() {
    return {
      propertyFilter: {
        PRIMARY_KEY: { $instr: "" },
        PRIMARY_VALUE: { $instr: "" },
        SECONDARY_KEY: { $instr: "" },
        SECONDARY_VALUE: { $instr: "" },
        PARANT_DATA_DICT_ID: "",
        PARANT_DATA_DICT_ID_ISNULL: true
      },
      numberRule: [
        { required: true, message: "排序号", trigger: "blur" },
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
        title: "字典查看器",
        visible: false,
        formData: {
          dictData: {},
          dictEntryData: []
        },
        tableProxy: {
          index: false,
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: ({ page, sort, filters }) => {
              if (
                this.viewTreeDialog.formData.dictData &&
                this.viewTreeDialog.formData.dictData.FND_DATA_DICT_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  FND_DATA_DICT_ID: this.viewTreeDialog.formData.dictData.FND_DATA_DICT_ID
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
                  listDictTree({ jsonFilter, page })
                    .then(res => {
                      if (res.data.code !== "0") {
                        this.$message.error(res.data.message);
                        reject([]);
                      }
                      const treeData = this.$utils.toArrayTree(res.data.data, { key: 'FND_DATA_DICT_ID', parentKey: 'PARANT_DATA_DICT_ID', children: 'children' });
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
          id: "dictEntry_view_1",
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
          { field: "FND_DATA_DICT_ID", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "index", width: 60 },
          { field: "FND_DATA_DICT_ID", title: "字典标识", remoteSort: true },
          { field: "PRIMARY_KEY", title: "主标识", remoteSort: true, treeNode: true },
          { field: "PRIMARY_VALUE", title: "主要数据", remoteSort: true },
          { field: "SECONDARY_KEY", title: "次标识", remoteSort: true },
          { field: "SECONDARY_VALUE", title: "次要数据", remoteSort: true },
          { field: "ORDER_RANK", title: "排序号", remoteSort: true },
          { field: "DISABLE", title: "禁用标识", remoteSort: true,
            editRender: {
              name: "select",
              defaultValue: "0",
              options: [
                { label: "否", value: "0" },
                { label: "是", value: "1" }
              ]
            }
          },
          { field: "PARANT_DATA_DICT_ID", title: "父字典标识", remoteSort: true },
          { field: "FILE_PATH_VALUE", title: "文件路径数据", remoteSort: true },
          { field: "IMAGE_PATH_VALUE", title: "图片路径数据", remoteSort: true },
          {
            field: "RICH_TEXT_VALUE",
            title: "富文本属性值",
            showOverflow: true
          },
          { field: "CREATION_DATE", title: "创建时间", remoteSort: true },
          { field: "CREATED_BY", title: "创建人", remoteSort: true },
          { field: "LAST_UPDATE_DATE", title: "修改时间", remoteSort: true },
          { field: "LAST_UPDATED_BY", title: "修改人", remoteSort: true }
        ]
      },
      editTreeDialog: {
        title: "字典结构",
        visible: false,
        viewOnly: false,
        formData: {
          dictData: {},
          dictEntryData: []
        }
      },
      dictEntry: {
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
                this.editTreeDialog.formData.dictData &&
                this.editTreeDialog.formData.dictData.FND_DATA_DICT_ID
              ) {
                // 处理排序条件
                const jsonFilter = {
                  PARANT_DATA_DICT_ID: this.editTreeDialog.formData.dictData.FND_DATA_DICT_ID
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
                  listDictEntry({ jsonFilter, page })
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
                delDictEntry({
                  dictData: this.editTreeDialog.formData.dictData,
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
                saveDictEntry({
                  dictData: this.editTreeDialog.formData.dictData,
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
          id: "dictEntry_edit_1",
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
          DISABLE: [
            { required: true, message: "请选择禁用标识", trigger: "blur" }
          ]
        },
        customColumns: [
          { field: "FND_DATA_DICT_ID", visible: false },
          { field: "CREATION_DATE", visible: false },
          { field: "CREATED_BY", visible: false },
          { field: "LAST_UPDATE_DATE", visible: false },
          { field: "LAST_UPDATED_BY", visible: false }
        ],
        tableColumn: [
          { type: "selection", width: 50 },
          { type: "index", width: 60 },
          { field: "FND_DATA_DICT_ID", title: "字典标识", remoteSort: true },
          { field: "PRIMARY_KEY", title: "主标识", remoteSort: true, editRender: { name: "input" }},
          { field: "PRIMARY_VALUE", title: "主要数据", remoteSort: true, editRender: { name: "input" }},
          { field: "SECONDARY_KEY", title: "次标识", remoteSort: true, editRender: { name: "input" }},
          { field: "SECONDARY_VALUE", title: "次要数据", remoteSort: true, editRender: { name: "input" }},
          { field: "ORDER_RANK", title: "排序号", remoteSort: true, editRender: { name: "input" }},
          { field: "DISABLE", title: "禁用标识", remoteSort: true,
            editRender: {
              name: "select",
              options: [
                { label: "否", value: "0" },
                { label: "是", value: "1" }
              ]
            }
          },
          { field: "PARANT_DATA_DICT_ID", title: "父字典标识", remoteSort: true },
          { field: "FILE_PATH_VALUE", title: "文件路径数据", remoteSort: true, editRender: { name: "input" }},
          { field: "IMAGE_PATH_VALUE", title: "图片路径数据", remoteSort: true, editRender: { name: "input" }},
          {
            field: "RICH_TEXT_VALUE",
            title: "富文本属性值",
            showOverflow: true, editRender: { name: "input" }
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

            if (jsonFilter.PARANT_DATA_DICT_ID_ISNULL) {
              jsonFilter.PARANT_DATA_DICT_ID = { "$null": "true" };
            }

            jsonFilter.PARANT_DATA_DICT_ID_ISNULL = "";

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
        id: "dict_edit_2",
        buttons: [
          { code: "delete_selection", name: "删除选中" },
          { code: "export", name: "导出.csv" },
          { code: "viewTree", name: "查看字典结构" },
          { code: "editTree", name: "编辑字典层级结构" }
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
        { field: "FND_DATA_DICT_ID", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "FND_DATA_DICT_ID", title: "字典标识", remoteSort: true },
        { field: "PRIMARY_KEY", title: "主标识", remoteSort: true },
        { field: "PRIMARY_VALUE", title: "主要数据", remoteSort: true },
        { field: "SECONDARY_KEY", title: "次标识", remoteSort: true },
        { field: "SECONDARY_VALUE", title: "次要数据", remoteSort: true },
        { field: "ORDER_RANK", title: "排序号", remoteSort: true },
        { field: "DISABLE", title: "禁用标识", remoteSort: true,
          editRender: {
            name: "select",
            defaultValue: "0",
            options: [
              { label: "否", value: "0" },
              { label: "是", value: "1" }
            ]
          }
        },
        { field: "PARANT_DATA_DICT_ID", title: "父字典标识", remoteSort: true },
        { field: "FILE_PATH_VALUE", title: "文件路径数据", remoteSort: true },
        { field: "IMAGE_PATH_VALUE", title: "图片路径数据", remoteSort: true },
        {
          field: "RICH_TEXT_VALUE",
          title: "富文本属性值",
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
      this.editTreeDialog.formData.dictData = {};
    },
    closeViewTreeDialog() {
      this.viewTreeDialog.visible = false;
      this.viewTreeDialog.formData.dictData = {};
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
          this.viewTreeDialog.formData.dictData = rows[0];
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
          this.editTreeDialog.formData.dictData = rows[0];
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
      if (!row.PARANT_DATA_DICT_ID) {
        row.PARANT_DATA_DICT_ID = this.editTreeDialog.formData.dictData.FND_DATA_DICT_ID;
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
      if (!row.PARANT_DATA_DICT_ID) {
        row.PARANT_DATA_DICT_ID = this.editTreeDialog.formData.dictData.FND_DATA_DICT_ID;
      }
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
