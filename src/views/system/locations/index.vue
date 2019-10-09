<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
          <el-form-item label="地址名称" prop="LOCATION_CODE.$instr">
            <el-input v-model="propertyFilter.LOCATION_CODE.$instr" clearable placeholder="地址名称" />
          </el-form-item>
          <el-form-item label="地址描述" prop="DESCRIPTION.$instr">
            <el-input v-model="propertyFilter.DESCRIPTION.$instr" clearable placeholder="地址描述" />
          </el-form-item>
          <el-form-item label="地址" prop="ADDRESS_LINE_1.$instr">
            <el-input v-model="propertyFilter.ADDRESS_LINE_1.$instr" clearable placeholder="地址" />
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
      row-id="LOCATION_ID"
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
      width="60%"
    >
      <el-form ref="editForm" label-width="100px" :model="editDialog.formData">
        <el-form-item label="地址ID" prop="LOCATION_ID" hidden>
          <el-input v-model="editDialog.formData.LOCATION_ID" placeholder="请输入内容" hidden />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="地址名称"
              prop="LOCATION_CODE"
              :rules="[{required:true, message:'应用简称', trigger:'blur'}]"
            >
              <el-input v-model="editDialog.formData.LOCATION_CODE" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="DESCRIPTION">
              <el-input v-model="editDialog.formData.DESCRIPTION" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="失效日期" prop="INACTIVE_DATE">
              <el-date-picker
                v-model="editDialog.formData.INACTIVE_DATE"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法律地址" prop="LEGAL_ADDRESS_FLAG">
              <el-switch
                v-model="editDialog.formData.LEGAL_ADDRESS_FLAG"
                active-value="true"
                inactive-value="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="地址范围">
            <el-radio-group v-model="editDialog.formData.SCOPE">
              <el-radio label="GLOBAL">全局</el-radio>
              <el-radio label="LOCAL">本地</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <div class="tab-container">
          <el-tabs style="margin-top:15px;" type="border-card">
            <el-tab-pane label="地址详情">
              <el-form-item label="地址风格" prop="STYLE">
                <el-input v-model="editDialog.formData.STYLE" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="时区" prop="TIMEZONE_CODE">
                <el-input v-model="editDialog.formData.TIMEZONE_CODE" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="地址1" prop="ADDRESS_LINE_1">
                <el-input v-model="editDialog.formData.ADDRESS_LINE_1" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="地址2" prop="ADDRESS_LINE_2">
                <el-input v-model="editDialog.formData.ADDRESS_LINE_2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="地址3" prop="ADDRESS_LINE_3">
                <el-input v-model="editDialog.formData.ADDRESS_LINE_3" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="国家" prop="COUNTRY">
                <el-input v-model="editDialog.formData.COUNTRY" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="省份" prop="PROVINCE">
                <el-input v-model="editDialog.formData.PROVINCE" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="城市/城镇" prop="TOWN_OR_CITY">
                <el-input v-model="editDialog.formData.TOWN_OR_CITY" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="邮编" prop="POST_CODE">
                <el-input v-model="editDialog.formData.POST_CODE" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="行政区划代码" prop="AREA_CODE">
                <el-input v-model="editDialog.formData.AREA_CODE" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="传真" prop="FAX">
                <el-input v-model="editDialog.formData.FAX" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="联系电话1" prop="TELEPHONE_NUMBER_1">
                <el-input v-model="editDialog.formData.TELEPHONE_NUMBER_1" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="联系电话2" prop="TELEPHONE_NUMBER_2">
                <el-input v-model="editDialog.formData.TELEPHONE_NUMBER_2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="联系电话3" prop="TELEPHONE_NUMBER_3">
                <el-input v-model="editDialog.formData.TELEPHONE_NUMBER_3" placeholder="请输入内容" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="发运详情">
              <el-form-item label="联系人" prop="CONTACT">
                <el-input v-model="editDialog.formData.CONTACT" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="发运地址id" prop="SHIP_TO_LOCATION_ID" :rules="numberRule">
                <el-input
                  v-model.number="editDialog.formData.SHIP_TO_LOCATION_ID"
                  placeholder="请输入内容"
                />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="发运地址" prop="SHIP_TO_SITE_FLAG">
                    <el-switch
                      v-model="editDialog.formData.SHIP_TO_SITE_FLAG"
                      active-value="true"
                      inactive-value="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接收地址" prop="RECEIVING_SITE_FLAG">
                    <el-switch
                      v-model="editDialog.formData.RECEIVING_SITE_FLAG"
                      active-value="true"
                      inactive-value="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开票地址" prop="BILL_TO_SITE_FLAG">
                    <el-switch
                      v-model="editDialog.formData.BILL_TO_SITE_FLAG"
                      active-value="true"
                      inactive-value="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="内部地址" prop="IN_ORGANIZATION_FLAG">
                    <el-switch
                      v-model="editDialog.formData.IN_ORGANIZATION_FLAG"
                      active-value="true"
                      inactive-value="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="办公地址" prop="OFFICE_SITE_FLAG">
                    <el-switch
                      v-model="editDialog.formData.OFFICE_SITE_FLAG"
                      active-value="true"
                      inactive-value="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="其他信息">
              <el-form-item label="地理信息" prop="GEOMETRY">
                <el-input v-model="editDialog.formData.GEOMETRY" placeholder="请输入内容" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
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
import { list, save, del } from "@/api/locations";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  data() {
    return {
      propertyFilter: {
        LOCATION_CODE: { $instr: "" },
        DESCRIPTION: { $instr: "" },
        ADDRESS_LINE_1: { $instr: "" }
      },
      editDialog: {
        title: "编辑",
        visible: false,
        formData: {}
      },
      numberRule: [
        { required: false, message: "请输入整数", trigger: "blur" },
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
        id: "locations_edit_1",
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
        { field: "LOCATION_ID", visible: false },
        { field: "BUSINESS_GROUP_ID", visible: false },
        { field: "INACTIVE_DATE", visible: false },
        { field: "FAX", visible: false },
        { field: "STYLE", visible: false },
        { field: "TAX_NAME", visible: false },
        { field: "TIMEZONE_CODE", visible: false },
        { field: "SCOPE", visible: false },
        { field: "ADDRESS_LINE_2", visible: false },
        { field: "ADDRESS_LINE_3", visible: false },
        { field: "TELEPHONE_NUMBER_2", visible: false },
        { field: "TELEPHONE_NUMBER_3", visible: false },
        { field: "REGION_1", visible: false },
        { field: "REGION_2", visible: false },
        { field: "REGION_3", visible: false },
        { field: "GEOMETRY", visible: false },
        { field: "SHIP_TO_LOCATION_ID", visible: false },
        { field: "SHIP_TO_SITE_FLAG", visible: false },
        { field: "RECEIVING_SITE_FLAG", visible: false },
        { field: "BILL_TO_SITE_FLAG", visible: false },
        { field: "IN_ORGANIZATION_FLAG", visible: false },
        { field: "OFFICE_SITE_FLAG", visible: false },
        { field: "SHIP_TO_LOCATION_ID", visible: false },
        { field: "ECE_TP_LOCATION_CODE", visible: false },
        { field: "INVENTORY_ORGANIZATION_ID", visible: false },
        { field: "OBJECT_VERSION_NUMBER", visible: false },
        { field: "LOC_INFORMATION13", visible: false },
        { field: "LOC_INFORMATION14", visible: false },
        { field: "LOC_INFORMATION15", visible: false },
        { field: "LOC_INFORMATION16", visible: false },
        { field: "LOC_INFORMATION17", visible: false },
        { field: "LOC_INFORMATION18", visible: false },
        { field: "LOC_INFORMATION19", visible: false },
        { field: "LOC_INFORMATION20", visible: false },
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
        { field: "GLOBAL_ATTRIBUTE_CATEGORY", visible: false },
        { field: "GLOBAL_ATTRIBUTE1", visible: false },
        { field: "GLOBAL_ATTRIBUTE2", visible: false },
        { field: "GLOBAL_ATTRIBUTE3", visible: false },
        { field: "GLOBAL_ATTRIBUTE4", visible: false },
        { field: "GLOBAL_ATTRIBUTE5", visible: false },
        { field: "GLOBAL_ATTRIBUTE6", visible: false },
        { field: "GLOBAL_ATTRIBUTE7", visible: false },
        { field: "GLOBAL_ATTRIBUTE8", visible: false },
        { field: "GLOBAL_ATTRIBUTE9", visible: false },
        { field: "GLOBAL_ATTRIBUTE10", visible: false },
        { field: "GLOBAL_ATTRIBUTE11", visible: false },
        { field: "GLOBAL_ATTRIBUTE12", visible: false },
        { field: "GLOBAL_ATTRIBUTE13", visible: false },
        { field: "GLOBAL_ATTRIBUTE14", visible: false },
        { field: "GLOBAL_ATTRIBUTE15", visible: false },
        { field: "GLOBAL_ATTRIBUTE16", visible: false },
        { field: "GLOBAL_ATTRIBUTE17", visible: false },
        { field: "GLOBAL_ATTRIBUTE18", visible: false },
        { field: "GLOBAL_ATTRIBUTE19", visible: false },
        { field: "GLOBAL_ATTRIBUTE20", visible: false },
        { field: "CREATION_DATE", visible: false },
        { field: "CREATED_BY", visible: false },
        { field: "LAST_UPDATE_DATE", visible: false },
        { field: "LAST_UPDATED_BY", visible: false }
      ],
      tableColumn: [
        { type: "selection", width: 50 },
        { type: "index", width: 60 },
        { field: "LOCATION_ID", title: "地址标识", remoteSort: true },
        { field: "LOCATION_CODE", title: "地址名称", remoteSort: true },
        { field: "BUSINESS_GROUP_ID", title: "业务组标识", remoteSort: true },
        { field: "DESCRIPTION", title: "描述", remoteSort: true },
        { field: "SCOPE", title: "地址范围", remoteSort: true },
        { field: "INACTIVE_DATE", title: "失效日期", remoteSort: true },
        { field: "LEGAL_ADDRESS_FLAG", title: "法律地址", remoteSort: true },
        { field: "STYLE", title: "地址风格", remoteSort: true },
        { field: "TIMEZONE_CODE", title: "时区", remoteSort: true },
        { field: "ADDRESS_LINE_1", title: "地址1", remoteSort: true },
        { field: "ADDRESS_LINE_2", title: "地址2", remoteSort: true },
        { field: "ADDRESS_LINE_3", title: "地址3", remoteSort: true },
        { field: "COUNTRY", title: "国家", remoteSort: true },
        { field: "PROVINCE", title: "省份", remoteSort: true },
        { field: "TOWN_OR_CITY", title: "城市/城镇", remoteSort: true },
        { field: "POST_CODE", title: "邮编", remoteSort: true },
        { field: "AREA_CODE", title: "行政区划代码", remoteSort: true },
        { field: "FAX", title: "传真", remoteSort: true },
        { field: "TAX_NAME", title: "税务代码", remoteSort: true },
        { field: "TELEPHONE_NUMBER_1", title: "联系电话1", remoteSort: true },
        { field: "TELEPHONE_NUMBER_2", title: "联系电话2", remoteSort: true },
        { field: "TELEPHONE_NUMBER_3", title: "联系电话3", remoteSort: true },
        { field: "REGION_1", title: "区域1", remoteSort: true },
        { field: "REGION_2", title: "区域2", remoteSort: true },
        { field: "REGION_3", title: "区域3", remoteSort: true },
        { field: "CONTACT", title: "联系人", remoteSort: true },
        { field: "SHIP_TO_LOCATION_ID", title: "发运地址id", remoteSort: true },
        { field: "SHIP_TO_SITE_FLAG", title: "发运地址", remoteSort: true },
        { field: "RECEIVING_SITE_FLAG", title: "接收地址", remoteSort: true },
        { field: "BILL_TO_SITE_FLAG", title: "开票地址", remoteSort: true },
        { field: "IN_ORGANIZATION_FLAG", title: "内部地址", remoteSort: true },
        { field: "OFFICE_SITE_FLAG", title: "办公地址", remoteSort: true },
        {
          field: "ECE_TP_LOCATION_CODE",
          title: "ET地址代码",
          remoteSort: true
        },
        { field: "GEOMETRY", title: "地理信息", remoteSort: true },
        {
          field: "INVENTORY_ORGANIZATION_ID",
          title: "库存组织",
          remoteSort: true
        },
        { field: "OBJECT_VERSION_NUMBER", title: "版本号", remoteSort: true },
        { field: "LOC_INFORMATION13", title: "地址信息13", remoteSort: true },
        { field: "LOC_INFORMATION14", title: "地址信息14", remoteSort: true },
        { field: "LOC_INFORMATION15", title: "地址信息15", remoteSort: true },
        { field: "LOC_INFORMATION16", title: "地址信息16", remoteSort: true },
        { field: "LOC_INFORMATION17", title: "地址信息17", remoteSort: true },
        { field: "LOC_INFORMATION18", title: "地址信息18", remoteSort: true },
        { field: "LOC_INFORMATION19", title: "地址信息19", remoteSort: true },
        { field: "LOC_INFORMATION20", title: "地址信息20", remoteSort: true },
        { field: "ATTRIBUTE_CATEGORY", title: "属性目录", remoteSort: true },
        { field: "ATTRIBUTE1", title: "属性1", remoteSort: true },
        { field: "ATTRIBUTE2", title: "属性2", remoteSort: true },
        { field: "ATTRIBUTE3", title: "属性3", remoteSort: true },
        { field: "ATTRIBUTE4", title: "属性4", remoteSort: true },
        { field: "ATTRIBUTE5", title: "属性5", remoteSort: true },
        { field: "ATTRIBUTE6", title: "属性6", remoteSort: true },
        { field: "ATTRIBUTE7", title: "属性7", remoteSort: true },
        { field: "ATTRIBUTE8", title: "属性8", remoteSort: true },
        { field: "ATTRIBUTE9", title: "属性9", remoteSort: true },
        { field: "ATTRIBUTE10", title: "属性10", remoteSort: true },
        { field: "ATTRIBUTE11", title: "属性11", remoteSort: true },
        { field: "ATTRIBUTE12", title: "属性12", remoteSort: true },
        { field: "ATTRIBUTE13", title: "属性13", remoteSort: true },
        { field: "ATTRIBUTE14", title: "属性14", remoteSort: true },
        { field: "ATTRIBUTE15", title: "属性15", remoteSort: true },
        { field: "ATTRIBUTE16", title: "属性16", remoteSort: true },
        { field: "ATTRIBUTE17", title: "属性17", remoteSort: true },
        { field: "ATTRIBUTE18", title: "属性18", remoteSort: true },
        { field: "ATTRIBUTE19", title: "属性19", remoteSort: true },
        { field: "ATTRIBUTE20", title: "属性20", remoteSort: true },
        {
          field: "GLOBAL_ATTRIBUTE_CATEGORY",
          title: "全局属性目录",
          remoteSort: true
        },
        { field: "GLOBAL_ATTRIBUTE1", title: "全局属性1", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE2", title: "全局属性2", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE3", title: "全局属性3", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE4", title: "全局属性4", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE5", title: "全局属性5", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE6", title: "全局属性6", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE7", title: "全局属性7", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE8", title: "全局属性8", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE9", title: "全局属性9", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE10", title: "全局属性10", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE11", title: "全局属性11", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE12", title: "全局属性12", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE13", title: "全局属性13", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE14", title: "全局属性14", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE15", title: "全局属性15", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE16", title: "全局属性16", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE17", title: "全局属性17", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE18", title: "全局属性18", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE19", title: "全局属性19", remoteSort: true },
        { field: "GLOBAL_ATTRIBUTE20", title: "全局属性20", remoteSort: true },
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
