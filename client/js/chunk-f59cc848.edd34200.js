(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f59cc848"],{"0514":function(t,e,i){"use strict";i.d(e,"a",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"b",(function(){return a}));var n=[{status:-1,title:"Chọn tất cả"},{status:1,title:"Duyệt tạo",icon:"circle",type:"is-danger"},{status:2,title:"Duyệt cập nhật",icon:"circle",type:"is-danger"},{status:3,title:"Duyệt xóa",icon:"circle",type:"is-danger"}],o=[{text:"Chọn loại duyệt",value:null},{text:"Duyệt tạo",value:"1"},{text:"Duyệt cập nhật",value:"2"},{text:"Duyệt xóa",value:"3"}],a=[{text:"Không được duyệt",color:"has-text-danger"},{text:"Đã duyệt",color:"has-text-success"},{text:"Đang chờ",color:"has-text-primary-dark"},{text:"Đã hủy",color:"has-text-grey"}]},"05db":function(t,e,i){"use strict";i("5641")},2909:function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));var n=i("6b75");function o(t){if(Array.isArray(t))return Object(n["a"])(t)}i("a4d3"),i("e01a"),i("d3b7"),i("d28b"),i("3ca3"),i("ddb0"),i("a630");function a(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}var r=i("06c5");function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(t){return o(t)||a(t)||Object(r["a"])(t)||c()}},5641:function(t,e,i){},b2ee:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"dashboard-post-table"}},[i("b-table",{attrs:{data:t.verifications,paginated:!t.isTableEmpty,hoverable:"","pagination-rounded":"",selected:t.selectedVerification,"is-row-selectable":function(){return!0},loading:t.loading,"pagination-size":"is-small","per-page":t.itemsPerPage,total:t.totalCount,"backend-pagination":"","row-class":function(t,e){return"is-clickable"},"backend-sorting":""},on:{"update:selected":function(e){t.selectedVerification=e},"page-change":t.$on_pageChanged,sort:t.$on_sort,click:t.$on_rowClicked},scopedSlots:t._u([{key:"empty",fn:function(){return[i("empty-state",{attrs:{"image-src":"https://res.cloudinary.com/dml8e1w0z/image/upload/v1618931250/oop-learning-helper/post_empty_state_xcrbog.png",text:"Bạn không có bài duyệt nào"}})]},proxy:!0},t.isTableEmpty?null:{key:"footer",fn:function(){return[i("div",[i("span",{staticClass:"has-text-grey"},[t._v("Số lượng kết quả: ")]),i("span",{staticClass:"has-text-weight-bold"},[t._v(t._s(t.totalCount))])])]},proxy:!0}],null,!0)},[i("b-table-column",{attrs:{label:"ID",width:"40",numeric:"",centered:""},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[i("strong",[t._v(t._s(n.id))])]}}])}),i("b-table-column",{attrs:{label:"Tên bài viết",width:"300","cell-class":"is-align-items-center"},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[t._v(" "+t._s(i.post_title)+" ")]}}])}),i("b-table-column",{attrs:{label:"Loại duyệt",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[[i("b-tag",{attrs:{size:"is-small",type:"is-primary-dark"}},[t._v(" "+t._s(t.VERIFICATION_TYPES[n.type].text)+" ")])]]}}])}),i("b-table-column",{attrs:{field:"created_date",label:"Ngày tạo",width:"100",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[t._v(" "+t._s(new Date(i.created_date).toLocaleDateString("en-GB"))+" ")]}}])}),i("b-table-column",{attrs:{visible:t.isRowSelected&&t.filteredActions.length>0,label:"",width:"auto"}},[[i("section",{staticClass:"tooltip-section",staticStyle:{"margin-top":"-4px","margin-bottom":"-6px"}},t._l(t.filteredActions,(function(e,n){return i("b-tooltip",{key:e.id,attrs:{label:e.tooltip,type:e.type}},[i("b-button",{staticClass:"is-icon-button",attrs:{size:"is-small",rounded:"","icon-left":e.icon,type:e.type,outlined:e.outlined},on:{click:function(e){return e.stopPropagation(),t.actionHandler[n](e)}}})],1)})),1)]],2)],1)],1)},o=[],a=i("2909"),r=i("5530"),c=(i("d3b7"),i("3ca3"),i("ddb0"),i("a9e3"),i("4de4"),i("caad"),i("2532"),i("d81d"),i("0514")),s={name:"PostTable",components:{"empty-state":function(){return i.e("chunk-01f92af0").then(i.bind(null,"86d8"))}},props:{type:Number,searchOptions:{type:Object,default:function(){}},active:{type:Boolean,default:function(){return!1}}},inject:["manager_getPendingVerifications","manager_findVerifications","manager_verify","manager_unverify","previewSelectedPost"],data:function(){return{ACTIONS:[{icon:"eye",tooltip:"Xem trước",type:"is-primary",outlined:!0,statuses:[1,2]},{icon:"check",tooltip:"Duyệt",type:"is-success",outlined:!1,statuses:[2]},{icon:"ban",tooltip:"Không duyệt",type:"is-danger",outlined:!1,statuses:[2]}],verifications:[],VERIFICATION_TYPES:[],itemsPerPage:6,totalCount:0,page:1,sorter:{sort_by:"time",order:-1},actionHandler:[],selectedVerification:null,loading:!1}},created:function(){this.actionHandler.push(this.$on_viewButtonClicked,this.$on_verifyButtonClicked,this.$on_unverifyButtonClicked),this.VERIFICATION_TYPES=c["c"]},mounted:function(){this.$_loadAsyncData()},computed:{selectedVerificationId:function(){var t;return null===(t=this.selectedVerification)||void 0===t?void 0:t.verification_id},isRowSelected:function(){return null!==this.selectedVerification},selectedApi:function(){return 2===this.type?this.manager_getPendingVerifications:this.manager_findVerifications},filteredActions:function(){var t=this;return this.ACTIONS.filter((function(e){return e.statuses.includes(t.type)}))},isTableEmpty:function(){return 0===this.verifications.length}},watch:{active:function(t){t||(this.selectedVerification=null)},selectedVerification:function(t){this.$emit("selected",t)},verifications:function(){this.selectedVerification=null},searchOptions:function(t){this.page=1,this.$_loadAsyncData(t)}},methods:{$on_rowClicked:function(t){t.verification_id===this.selectedVerificationId&&(this.selectedVerification=null)},$on_pageChanged:function(t){this.page=t,this.$_loadAsyncData()},$on_sort:function(t,e){this.sorter["sort_by"]=t,this.sorter.sort_order=e,this.$_loadAsyncData()},$_loadAsyncData:function(){var t=this,e=Object(r["a"])(Object(r["a"])(Object(r["a"])({},this.searchOptions),this.sorter),{},{status:this.type,page:this.page,limit:this.itemsPerPage});this.selectedApi(e).then((function(e){var i=e.error,n=e.data;i||t.$_updateData(n)}))},$_updateData:function(t){var e,i=t.total_count,n=t.results;this.totalCount=i,this.verifications.length=0,(e=this.verifications).push.apply(e,Object(a["a"])(n.map((function(t,e){return t.id=e+1,t}))))},$_isActionsGroupShown:function(t){return this.selectedVerificationId===t.verification_id&&this.filteredActions.length>0},$on_viewButtonClicked:function(){this.previewSelectedPost()},$on_verifyButtonClicked:function(){var t=this;this.$buefy.dialog.confirm({title:"Duyệt bài viết",message:"Bạn chắc chắn muốn duyệt bài viết ?",confirmText:"Đồng ý",cancelText:"Hủy bỏ",type:"is-success",onConfirm:function(){t.manager_verify({verification_id:t.selectedVerificationId}).then((function(e){var i=e.error;i||t.$_removeVerificationFromTable(t.selectedVerificationId)}))}})},$on_unverifyButtonClicked:function(){var t=this;this.$buefy.dialog.confirm({title:"Hủy duyệt bài viết",message:"Bạn chắc chắn muốn hủy duyệt bài viết này?",confirmText:"Đồng ý",cancelText:"Hủy bỏ",type:"is-danger",onConfirm:function(){t.manager_unverify({verification_id:t.selectedVerificationId}).then((function(e){var i=e.error;i||t.$_removeVerificationFromTable(t.selectedVerificationId)}))}})},$_removeVerificationFromTable:function(t){this.verifications=this.verifications.filter((function(e){return e.verification_id!==t})),this.totalCount--}}},l=s,u=(i("05db"),i("2877")),d=Object(u["a"])(l,n,o,!1,null,"9d5c1ac0",null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-f59cc848.edd34200.js.map