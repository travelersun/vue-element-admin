<template>
  <el-dialog width="80%" title="选择组织" :visible.sync="fvisible" :append-to-body="true">
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="propertyFilterForm" :model="propertyFilter" :inline="true" size="small">
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
        class="vxe-table-element"
        :loading="loading"
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
import {
  list
} from "@/api/organization";
import { listLookupValues } from "@/api/fndLookup";
import { deleteEmptyProperty } from "@/utils/util";

export default {
  name: "OrganizationSelect",
  data() {
    return {
      propertyFilter: {
        NAME: { $instr: "" },
        TYPE: ""
      },
      context: {},
      fvisible: false,
      loading: false,
      orgType: [],
      orgClass: [],
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
        id: "full_edit_1",
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
        { type: "radio", width: 50 },
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
    showOrgSelect(e) {
      this.context = e;
      this.fvisible = true;
    },
    hideOrgSelect(e) {
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
