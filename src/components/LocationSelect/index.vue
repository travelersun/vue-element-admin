<template>
  <el-dialog width="80%" title="选择地址" :visible.sync="fvisible" :append-to-body="true">
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
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="Ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import XEAjax from "xe-ajax";
import { list } from "@/api/locations";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  name: "LocationSelect",
  data() {
    return {
      propertyFilter: {
        LOCATION_CODE: { $instr: "" },
        DESCRIPTION: { $instr: "" },
        ADDRESS_LINE_1: { $instr: "" }
      },
      context: {},
      fvisible: false,
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
                    return;
                  }
                  resolve(res.data);
                })
                .catch(err => {
                  this.$message.error(err.message);
                  reject(err.data);
                });
            });
          }
        }
      },
      toolbar: {
        id: "location_select_1",
        buttons: [
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
        { type: "radio", width: 50 },
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
    dbclick(
      { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, cell },
      event
    ) {
      this.$emit("okClick", row, this.context);
      this.$refs.xGrid.clearRadioRow();
    },
    cancel() {
      this.$emit("cancelClick", {});
      this.$refs.xGrid.clearRadioRow();
      this.context = {};
    },
    Ok() {
      const row = this.$refs.xGrid.getRadioRow();
      this.$emit("okClick", row, this.context);
      this.$refs.xGrid.clearRadioRow();
      this.context = {};
    },
    showLocationSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideLocationSelect(e) {
      this.context = {};
      this.fvisible = false;
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
