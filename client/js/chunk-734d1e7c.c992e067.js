(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-734d1e7c"],{"10a9":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"a",(function(){return o}));var n={data:function(){return{VERIFICATION_STATUS_STYLES:{0:{type:"is-danger",text:"Không được duyệt"},1:{type:"is-success",text:"Đã duyệt"},2:{type:"is-primary",text:"Đang chờ"},3:{type:"is-light",text:"Đã hủy"}},VERIFICATION_TYPE_STYLES:{1:{type:"is-primary",text:"Duyệt tạo"},2:{type:"is-primary",text:"Duyệt cập nhật"},3:{type:"is-danger",text:"Duyệt xóa"}}}}},a=i("2909"),o=(i("d81d"),i("4de4"),{data:function(){return{page:1,totalCount:0,verifications:[],itemsPerPage:6,sorter:{sort_by:"created_date",order:-1},selectedVerification:null}},watch:{selectedVerification:function(t){this.$emit("selected",t)},verifications:function(){this.selectedVerification=null}},computed:{selectedVerificationId:function(){var t;return null===(t=this.selectedVerification)||void 0===t?void 0:t.verification_id},isRowSelected:function(){return null!==this.selectedVerification},isTableEmpty:function(){return 0===this.verifications.length}},methods:{$m_updateTableData:function(t,e){var i;this.totalCount=t,this.verifications.length=0,(i=this.verifications).push.apply(i,Object(a["a"])(e.map((function(t,e){return t.id=e+1,t}))))},$m_removeVerificationFromTable:function(t){this.verifications=this.verifications.filter((function(e){return e.verification_id!==t})),this.totalCount--}}})},3997:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"verification-table"},[i("b-table",{attrs:{data:t.verifications,paginated:!t.isTableEmpty,hoverable:"","pagination-rounded":"",selected:t.selectedVerification,"is-row-selectable":function(){return!0},loading:t.loading,"pagination-size":"is-small","per-page":t.itemsPerPage,total:t.totalCount,"backend-pagination":"","row-class":function(t,e){return"is-clickable row--middle"},"backend-sorting":""},on:{"update:selected":function(e){t.selectedVerification=e},"page-change":t.$on_pageChanged,sort:t.$on_sort,click:t.$on_rowClicked},scopedSlots:t._u([{key:"empty",fn:function(){return[i("empty-state",{attrs:{"image-src":"https://res.cloudinary.com/dml8e1w0z/image/upload/v1618931250/oop-learning-helper/post_empty_state_xcrbog.png",text:"Bạn không có bài duyệt nào"}})]},proxy:!0},t.isTableEmpty?null:{key:"footer",fn:function(){return[i("div",[i("span",{staticClass:"has-text-grey"},[t._v("Số lượng kết quả: ")]),i("span",{staticClass:"has-text-weight-bold"},[t._v(t._s(t.totalCount))])])]},proxy:!0}],null,!0)},[i("b-table-column",{attrs:{label:"STT",width:"40",numeric:"",centered:""},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[i("strong",[t._v(t._s(n.id))])]}}])}),i("b-table-column",{attrs:{label:"Tên bài viết",width:"250","cell-class":"is-align-items-center"},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[t._v(" "+t._s(i.post_title)+" ")]}}])}),i("b-table-column",{attrs:{label:"Tình trạng",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row.status;return[[i("b-tag",{staticClass:"has-text-weight-bold",attrs:{size:"is-small",type:t.VERIFICATION_STATUS_STYLES[n].type}},[t._v(" "+t._s(t.VERIFICATION_STATUS_STYLES[n].text)+" ")])]]}}])}),i("b-table-column",{attrs:{field:"last_edited_date",label:"Ngày cập nhật",width:"130",numeric:"",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[t._v(" "+t._s(new Date(i.last_edited_date).toLocaleDateString("en-GB"))+" ")]}}])})],1)],1)},a=[],o=i("5530"),s=(i("d3b7"),i("3ca3"),i("ddb0"),i("2f62")),r=i("10a9"),c={name:"VerificationTable",components:{"empty-state":function(){return i.e("chunk-01f92af0").then(i.bind(null,"86d8"))}},mixins:[r["a"],r["b"]],props:{searchOptions:{type:Object,default:function(){}}},data:function(){return{loading:!1}},mounted:function(){this.$_loadAsyncData()},watch:{searchOptions:function(t){this.page=1,this.$_loadAsyncData(t)}},methods:Object(o["a"])(Object(o["a"])({},Object(s["b"])("POST",["creator_findVerifications"])),{},{$on_rowClicked:function(t){t.verification_id===this.selectedVerificationId&&(this.selectedVerification=null)},$on_pageChanged:function(t){this.page=t,this.$emit("pageChanged",t),this.$_loadAsyncData({sort:!0})},$on_sort:function(t,e){this.sorter["sort_by"]=t,this.sorter.sort_order=e,this.$_loadAsyncData({sort:!0})},$_loadAsyncData:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0;var i=null!==e&&void 0!==e?e:{},n=i.sort,a=void 0!==n&&n,s=Object(o["a"])(Object(o["a"])(Object(o["a"])({},this.searchOptions),a&&this.sorter),{},{page:this.page});this.creator_findVerifications(s).then((function(e){t.loading=!1;var i=e.error,n=e.data;if(!i){var a=n.results,o=n.total_count;t.$m_updateTableData(o,a)}}))}})},l=c,d=i("2877"),u=Object(d["a"])(l,n,a,!1,null,null,null);e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-734d1e7c.c992e067.js.map