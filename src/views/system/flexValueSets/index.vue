<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="值集名称" prop="FLEX_VALUE_SET_NAME.$instr">
            <el-input
              v-model="propertyFilter.FLEX_VALUE_SET_NAME.$instr"
              clearable
              placeholder="值集名称"
            />
          </el-form-item>
          <el-form-item label="描述" prop="DESCRIPTION.$instr">
            <el-input v-model="propertyFilter.DESCRIPTION.$instr" clearable placeholder="描述" />
          </el-form-item>
          <el-form-item label="父值集ID" prop="PARENT_FLEX_VALUE_SET_ID">
            <el-input
              v-model="propertyFilter.PARENT_FLEX_VALUE_SET_ID"
              clearable
              placeholder="父值集ID"
            />
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
      row-id="FLEX_VALUE_SET_ID"
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
      center
      width="60%"
    >
      <el-form ref="editForm" label-width="30%" :model="editDialog.formData">
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="值集名称"
              prop="FLEX_VALUE_SET_NAME"
              :rules="[{required:true,message:'请输入值集名称', trigger:'blur'}]"
            >
              <el-input
                v-model="editDialog.formData.FLEX_VALUE_SET_NAME"
                clearable
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="值集描述" prop="DESCRIPTION">
              <el-input v-model="editDialog.formData.DESCRIPTION" clearable placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="列表类型"
              prop="LONGLIST_FLAG"
              :rules="[{required:true,message:'请选择列表类型', trigger:'blur'}]"
            >
              <el-select v-model="editDialog.formData.LONGLIST_FLAG">
                <el-option
                  v-for="item in dataDict.listType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="安全类型"
              prop="SECURITY_ENABLED_FLAG"
              :rules="[{required:true,message:'请选择安全类型', trigger:'blur'}]"
            >
              <el-select v-model="editDialog.formData.SECURITY_ENABLED_FLAG">
                <el-option
                  v-for="item in dataDict.securityType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="保护标识"
              prop="PROTECTED_FLAG"
              :rules="[{required:true,message:'请选择保护标识', trigger:'blur'}]"
            >
              <el-select v-model="editDialog.formData.PROTECTED_FLAG">
                <el-option
                  v-for="item in dataDict.protectType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-card header="格式校验">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="格式类型"
                prop="FORMAT_TYPE"
                :rules="[{required:true,message:'请选择格式类型', trigger:'blur'}]"
              >
                <el-select v-model="editDialog.formData.FORMAT_TYPE">
                  <el-option
                    v-for="item in dataDict.formatType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大长度" prop="MAXIMUM_SIZE" :rules="numberRule">
                <el-input v-model="editDialog.formData.MAXIMUM_SIZE" clearable placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item
                label="数字（0-9）"
                prop="ALPHANUMERIC_ALLOWED_FLAG"
                :rules="[{required:true,message:'请选择是否为数字', trigger:'blur'}]"
              >
                <el-switch
                  v-model="editDialog.formData.ALPHANUMERIC_ALLOWED_FLAG"
                  active-value="Y"
                  inactive-value="N"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="精度" prop="NUMBER_PRECISION" :rules="numberRule">
                <el-input
                  v-model="editDialog.formData.NUMBER_PRECISION"
                  clearable
                  placeholder="请输入精度"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="大写（A-Z）"
                prop="UPPERCASE_ONLY_FLAG"
                :rules="[{required:true,message:'请选择是否为大写', trigger:'blur'}]"
              >
                <el-switch
                  v-model="editDialog.formData.UPPERCASE_ONLY_FLAG"
                  active-value="Y"
                  inactive-value="N"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="右对齐（001）"
                prop="NUMERIC_MODE_ENABLED_FLAG"
                :rules="[{required:true,message:'请是否右对齐', trigger:'blur'}]"
              >
                <el-switch
                  v-model="editDialog.formData.NUMERIC_MODE_ENABLED_FLAG"
                  active-value="Y"
                  inactive-value="N"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="最小值" prop="MINIMUM_VALUE">
                <el-input
                  v-model="editDialog.formData.MINIMUM_VALUE"
                  clearable
                  placeholder="请输入最小值"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大值" prop="MAXIMUM_VALUE">
                <el-input
                  v-model="editDialog.formData.MAXIMUM_VALUE"
                  clearable
                  placeholder="请输入最大值"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card header="值校验" style="margin-top: 10px;">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="验证类型"
                prop="VALIDATION_TYPE"
                :rules="[{required:true,message:'请选择验证类型', trigger:'blur'}]"
              >
                <el-select v-model="editDialog.formData.VALIDATION_TYPE" @change="validationTypeChg">
                  <el-option
                    v-for="item in dataDict.validationType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" :disabled="editInfoButDisable" @click="showeEit2Dialog">编辑信息</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item label="父值集ID" prop="PARENT_FLEX_VALUE_SET_ID" hidden>
          <el-input v-model="editDialog.formData.PARENT_FLEX_VALUE_SET_ID" hidden />
        </el-form-item>
        <el-form-item label="上下文值" prop="DEPENDANT_DEFAULT_VALUE" hidden>
          <el-input v-model="editDialog.formData.DEPENDANT_DEFAULT_VALUE" hidden />
        </el-form-item>
        <el-form-item label="上下文释义" prop="DEPENDANT_DEFAULT_MEANING" hidden>
          <el-input v-model="editDialog.formData.DEPENDANT_DEFAULT_MEANING" hidden />
        </el-form-item>
        <el-dialog
          :visible.sync="edit2Dialog.visible"
          :before-close="closeEdit2Dialog"
          :title="edit2Dialog.title"
          append-to-body
          width="40%"
        >
          <el-form ref="edit2Form" label-width="30%" :model="edit2Dialog.formData">
            <el-form-item label="表所属应用ID" hidden prop="TABLE_APPLICATION_ID">
              <el-input v-model="edit2Dialog.formData.TABLE_APPLICATION_ID" hidden />
            </el-form-item>
            <el-form-item label="编译后属性列名称" hidden prop="COMPILED_ATTRIBUTE_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.COMPILED_ATTRIBUTE_COLUMN_NAME" hidden />
            </el-form-item>
            <el-form-item label="是否启用列名称" hidden prop="ENABLED_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.ENABLED_COLUMN_NAME" hidden />
            </el-form-item>
            <el-form-item label="层级关系列名称" hidden prop="HIERARCHY_LEVEL_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.HIERARCHY_LEVEL_COLUMN_NAME" hidden />
            </el-form-item>
            <el-form-item label="启用日期列名称" hidden prop="START_DATE_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.START_DATE_COLUMN_NAME" hidden />
            </el-form-item>
            <el-form-item label="停用日期列名称" hidden prop="END_DATE_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.END_DATE_COLUMN_NAME" hidden />
            </el-form-item>
            <el-form-item label="是否允许汇总" hidden prop="SUMMARY_ALLOWED_FLAG">
              <el-input v-model="edit2Dialog.formData.SUMMARY_ALLOWED_FLAG" hidden />
            </el-form-item>
            <el-form-item label="汇总列名称" hidden prop="SUMMARY_COLUMN_NAME">
              <el-input v-model="edit2Dialog.formData.SUMMARY_COLUMN_NAME" hidden />
            </el-form-item>
            <el-row>
              <el-col :span="20">
                <el-form-item
                  label="表所属应用"
                  prop="APPLICATION_NAME"
                  :rules="[{required:true,message:'请选择表所属应用', trigger:'blur'}]"
                >
                  <el-input v-model="edit2Dialog.formData.APPLICATION_NAME" placeholder="请选择表所属应用" @focus="selectApp" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item
                  label="表集合"
                  prop="APPLICATION_TABLE_NAME"
                  :rules="[{required:true,message:'请输入表集合', trigger:'blur'}]"
                >
                  <el-input
                    v-model="edit2Dialog.formData.APPLICATION_TABLE_NAME"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入表集合逗号','分开"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px; margin-bottom: 10px;">
              <el-card header="表字段">
                <el-row>
                  <el-col style="text-align: center;" :span="12">
                    <el-tag>名称</el-tag>
                  </el-col>
                  <el-col style="text-align: center;" :span="7">
                    <el-tag>类型</el-tag>
                  </el-col>
                  <el-col style="text-align: center;" :span="5">
                    <el-tag>长度</el-tag>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="值"
                      prop="VALUE_COLUMN_NAME"
                      :rules="[{required:true,message:'请输入值列名称', trigger:'blur'}]"
                    >
                      <el-input
                        v-model="edit2Dialog.formData.VALUE_COLUMN_NAME"
                        placeholder="值列名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label
                      prop="VALUE_COLUMN_TYPE"
                      :rules="[{required:true,message:'请选择值列类型', trigger:'blur'}]"
                    >
                      <el-select v-model="edit2Dialog.formData.VALUE_COLUMN_TYPE">
                        <el-option
                          v-for="item in dataDict.formatType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label prop="VALUE_COLUMN_SIZE" :rules="valueNumberRule">
                      <el-input
                        v-model="edit2Dialog.formData.VALUE_COLUMN_SIZE"
                        placeholder="列长度"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="释义" prop="MEANING_COLUMN_NAME">
                      <el-input
                        v-model="edit2Dialog.formData.MEANING_COLUMN_NAME"
                        placeholder="释义列名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label prop="MEANING_COLUMN_TYPE">
                      <el-select v-model="edit2Dialog.formData.MEANING_COLUMN_TYPE">
                        <el-option
                          v-for="item in dataDict.formatType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label prop="MEANING_COLUMN_SIZE" :rules="numberRule">
                      <el-input
                        v-model="edit2Dialog.formData.MEANING_COLUMN_SIZE"
                        placeholder="列长度"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="ID" prop="ID_COLUMN_NAME">
                      <el-input
                        v-model="edit2Dialog.formData.ID_COLUMN_NAME"
                        placeholder="ID列名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label prop="ID_COLUMN_TYPE">
                      <el-select v-model="edit2Dialog.formData.ID_COLUMN_TYPE">
                        <el-option
                          v-for="item in dataDict.formatType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label prop="ID_COLUMN_SIZE" :rules="numberRule">
                      <el-input
                        v-model="edit2Dialog.formData.ID_COLUMN_SIZE"
                        placeholder="列长度"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="where/Order By" prop="ADDITIONAL_WHERE_CLAUSE">
                  <el-input
                    v-model="edit2Dialog.formData.ADDITIONAL_WHERE_CLAUSE"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入where/Order By子句"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="Additional Columns" prop="ADDITIONAL_QUICKPICK_COLUMNS">
                  <el-input
                    v-model="edit2Dialog.formData.ADDITIONAL_QUICKPICK_COLUMNS"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入快速选择列名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <application-select ref="appSelect" @okClick="appSelectOk" @cancelClick="appSelectCancel" />
          </el-form>
          <div slot="footer">
            <el-button @click="closeEdit2Dialog">返回</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
          </div>
        </el-dialog>
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
import { list, save, del, listValidationTable } from "@/api/flexValueSets";
import { deleteEmptyProperty } from "@/utils/util";
import ApplicationSelect from "@/components/ApplicationSelect";

export default {
  components: { ApplicationSelect },
  data() {
    return {
      propertyFilter: {
        FLEX_VALUE_SET_NAME: { $instr: "" },
        DESCRIPTION: { $instr: "" },
        PARENT_FLEX_VALUE_SET_ID: ""
      },
      editInfoButDisable: true,
      numberRule: [
        { required: false, message: "整数", trigger: "blur" },
        {
          validator(rule, value, callback) {
            if (!value || Number.isInteger(Number(value))) {
              callback();
            } else {
              callback(new Error("请输入整数"));
            }
          },
          trigger: "blur"
        }
      ],
      valueNumberRule: [
        { required: true, message: "请输入值列长度", trigger: "blur" },
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
      dataDict: {
        formatType: [
          { label: "Char", value: "CHAR" },
          { label: "Number", value: "NUMBER" },
          { label: "Time", value: "TIME" },
          { label: "Date", value: "DATE" },
          { label: "DateTime", value: "DATETIME" }
        ],
        validationType: [
          { label: "None", value: "NONE" },
          { label: "Independent", value: "I" },
          { label: "Dependent", value: "D" },
          { label: "Table", value: "TABLE" },
          { label: "Special", value: "S" },
          { label: "Pair", value: "P" },
          { label: "Translatable Independent", value: "TI" },
          { label: "Translatable Dependent", value: "TD" }
        ],
        listType: [
          { label: "Poplist", value: "P" },
          { label: "List of Values", value: "LOV" },
          { label: "Long List of Values", value: "LLOV" }
        ],
        securityType: [
          { label: "无", value: "N" },
          { label: "有", value: "Y" }
        ],
        protectType: [{ label: "否", value: "N" }, { label: "是", value: "Y" }]
      },
      editDialog: {
        title: "值集定义",
        visible: false,
        formData: {}
      },
      edit2Dialog: {
        title: "验证表信息",
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
        id: "valueSet_edit_1",
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
        { field: "FLEX_VALUE_SET_ID", visible: false },
        { field: "PARENT_FLEX_VALUE_SET_ID", visible: false },
        { field: "DEPENDANT_DEFAULT_VALUE", visible: false },
        { field: "DEPENDANT_DEFAULT_MEANING", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "FLEX_VALUE_SET_ID", title: "值集ID", remoteSort: true },
        {
          field: "FLEX_VALUE_SET_NAME",
          title: "值集名称",
          remoteSort: true
        },
        { field: "DESCRIPTION", title: "描述", remoteSort: true },
        {
          field: "LONGLIST_FLAG",
          title: "列表类型",
          remoteSort: true,
          filters: [
            { label: "Poplist", value: "P" },
            { label: "List of Values", value: "LOV" },
            { label: "Long List of Values", value: "LLOV" }
          ],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [
              { label: "Poplist", value: "P" },
              { label: "List of Values", value: "LOV" },
              { label: "Long List of Values", value: "LLOV" }
            ]
          }
        },
        {
          field: "VALIDATION_TYPE",
          title: "验证类型",
          remoteSort: true,
          filters: [
            { label: "None", value: "NONE" },
            { label: "Independent", value: "I" },
            { label: "Dependent", value: "D" },
            { label: "Table", value: "TABLE" },
            { label: "Special", value: "S" },
            { label: "Pair", value: "P" },
            { label: "Translatable Independent", value: "TI" },
            { label: "Translatable Dependent", value: "TD" }
          ],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [
              { label: "None", value: "NONE" },
              { label: "Independent", value: "I" },
              { label: "Dependent", value: "D" },
              { label: "Table", value: "TABLE" },
              { label: "Special", value: "S" },
              { label: "Pair", value: "P" },
              { label: "Translatable Independent", value: "TI" },
              { label: "Translatable Dependent", value: "TD" }
            ]
          }
        },
        {
          field: "PROTECTED_FLAG",
          title: "保护标识",
          remoteSort: true,
          filters: [{ label: "否", value: "N" }, { label: "是", value: "Y" }],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [{ label: "否", value: "N" }, { label: "是", value: "Y" }]
          }
        },
        {
          field: "SECURITY_ENABLED_FLAG",
          title: "安全标识",
          remoteSort: true,
          filters: [{ label: "无", value: "N" }, { label: "有", value: "Y" }],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [{ label: "无", value: "N" }, { label: "有", value: "Y" }]
          }
        },
        {
          field: "FORMAT_TYPE",
          title: "格式类型",
          remoteSort: true,
          filters: [
            { label: "Char", value: "CHAR" },
            { label: "Number", value: "NUMBER" },
            { label: "Time", value: "TIME" },
            { label: "Date", value: "DATE" },
            { label: "DateTime", value: "DATETIME" }
          ],
          filterMultiple: false,
          editRender: {
            name: "select",
            options: [
              { label: "Char", value: "CHAR" },
              { label: "Number", value: "NUMBER" },
              { label: "Time", value: "TIME" },
              { label: "Date", value: "DATE" },
              { label: "DateTime", value: "DATETIME" }
            ]
          }
        },
        { field: "MAXIMUM_SIZE", title: "最大长度", remoteSort: true },
        { field: "NUMBER_PRECISION", title: "精度", remoteSort: true },
        { field: "ALPHANUMERIC_ALLOWED_FLAG", title: "数字", remoteSort: true },
        { field: "UPPERCASE_ONLY_FLAG", title: "大写", remoteSort: true },
        {
          field: "NUMERIC_MODE_ENABLED_FLAG",
          title: "右对齐",
          remoteSort: true
        },
        { field: "MINIMUM_VALUE", title: "最小值", remoteSort: true },
        { field: "MAXIMUM_VALUE", title: "最大值", remoteSort: true },
        {
          field: "PARENT_FLEX_VALUE_SET_ID",
          title: "父值集ID",
          remoteSort: true
        },
        {
          field: "DEPENDANT_DEFAULT_VALUE",
          title: "上下文值",
          remoteSort: true
        },
        {
          field: "DEPENDANT_DEFAULT_MEANING",
          title: "上下文释义",
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
    closeEdit2Dialog() {
      this.$refs.edit2Form.clearValidate();
      this.edit2Dialog.visible = false;
      this.$refs.edit2Form.resetFields();
    },
    dbclick(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      this.editDialog.formData = row;
      this.editInfoButDisable = true;
      if (row.VALIDATION_TYPE === "TABLE") {
        this.editInfoButDisable = false;
      }
      this.editDialog.visible = true;
    },
    showeEit2Dialog() {
      const theThis = this;
      const flexValueSetId = this.editDialog.formData.FLEX_VALUE_SET_ID;

      if (theThis.editDialog.formData["validationTables"]) {
        theThis.edit2Dialog.formData = theThis.editDialog.formData["validationTables"];
        theThis.edit2Dialog.visible = true;
      } else {
        if (flexValueSetId) {
          const jsonFilter = { FLEX_VALUE_SET_ID: flexValueSetId };
          const page = { total: 1, pageSize: 10, currentPage: 1 };
          listValidationTable({ jsonFilter, page })
            .then(res => {
              if (res.data.code !== "0") {
                theThis.$message.error(res.data.message);
                return;
              }
              if (res.data.data && res.data.data.list && res.data.data.list.length > 0) {
                theThis.edit2Dialog.formData = res.data.data.list[0];
              } else {
                theThis.edit2Dialog.formData = {};
              }
              theThis.edit2Dialog.visible = true;
            })
            .catch(err => {
              theThis.$message.error(err.message);
            });
        } else {
          theThis.edit2Dialog.visible = true;
          theThis.edit2Dialog.formData = {};
        }
      }
    },
    confirm() {
      const theThis = this;
      this.$refs.edit2Form.validate(function(valid) {
        if (!valid) {
          return;
        }
        theThis.editDialog.formData["validationTables"] =
          theThis.edit2Dialog.formData;
        theThis.edit2Dialog.visible = false;
      });
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
    selectApp(e) {
      this.$refs.appSelect.showFuncSelect();
    },
    appSelectOk(e, i) {
      if (e) {
        this.$set(this.edit2Dialog.formData, "TABLE_APPLICATION_ID", e.APPLICATION_ID);
        this.$set(
          this.edit2Dialog.formData,
          "APPLICATION_NAME",
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
    validationTypeChg(e) {
      if (e === "TABLE") {
        this.editInfoButDisable = false;
      } else {
        this.editInfoButDisable = true;
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
