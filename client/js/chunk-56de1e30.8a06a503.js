(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-56de1e30"],{"289dc":function(t,e,n){},"32b5":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"common-question-table"}},[n("b-table",{ref:"table",attrs:{data:t.questions,paginated:"",hoverable:"","pagination-rounded":"",selected:t.selectedQuestion,detailed:"",anima:"","detail-key":"id","has-detailed-visible":function(t){return!1},"show-detail-icon":!1,loading:t.loading,"pagination-size":"is-small","per-page":t.itemsPerPage,total:t.totalCount,"backend-pagination":"","row-class":function(t,e){return"is-clickable"}},on:{"update:selected":function(e){t.selectedQuestion=e},"page-change":t.$on_pageChanged,click:t.$on_rowClicked},scopedSlots:t._u([{key:"detail",fn:function(e){return[n("h1",[t._v(" "+t._s(e.row.answer)+" ")]),n("hr"),n("section",{staticClass:"tooltip-section"},t._l(t.features,(function(a,i){return n("b-tooltip",{key:a.id,attrs:{position:"is-left",label:a.tooltip,type:a.type}},[n("b-button",{staticClass:"is-icon-button",attrs:{size:"is-small","icon-left":a.icon,type:a.type,outlined:a.outlined},on:{click:function(n){return n.stopPropagation(),t.featureHandler[i](e.row)}}})],1)})),1)]}},{key:"empty",fn:function(){return[n("empty-state",{attrs:{"image-src":"#",text:"Chưa có câu hỏi nào"}})]},proxy:!0},{key:"footer",fn:function(){return[n("div",[n("span",{staticClass:"has-text-grey"},[t._v("Số lượng kết quả: ")]),n("span",{staticClass:"has-text-weight-bold"},[t._v(t._s(t.totalCount))])])]},proxy:!0}])},[n("b-table-column",{attrs:{label:"ID",numeric:"",width:"20",centered:""},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[n("strong",[t._v(t._s(a.id))])]}}])}),n("b-table-column",{attrs:{label:"Câu hỏi"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[t._v(" "+t._s(n.question)+" ")]}}])}),n("b-table-column",{attrs:{label:"Nhãn dán",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[a.tag_id?n("b-tag",{attrs:{type:"is-primary-dark"}},[n("span",{staticClass:"has-text-weight-bold"},[t._v(t._s(a.tag_value))])]):n("span",{staticClass:"has-text-grey"},[t._v("Chưa có nhãn")])]}}])})],1),n("b-modal",{attrs:{"has-modal-card":""},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[n("edit-question-form",{attrs:{question:t.selectedQuestion},on:{submitted:t.$on_formSubmitted}})],1)],1)},i=[],s=n("2909"),o=n("5530"),u=n("1da1"),l=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("d81d"),n("4de4"),{name:"QandATable",components:{"edit-question-form":function(){return Promise.all([n.e("chunk-2a303700"),n.e("chunk-932ac754"),n.e("chunk-210ea2fa"),n.e("chunk-072e95f0"),n.e("chunk-1d3364de")]).then(n.bind(null,"e118"))},"empty-state":function(){return n.e("chunk-01f92af0").then(n.bind(null,"86d8"))}},props:{searchOptions:Object},inject:["$api_findQuestions"],data:function(){return{itemsPerPage:6,totalCount:0,questions:[],selectedQuestion:null,features:[{icon:"pen",tooltip:"Chỉnh sửa câu hỏi",type:"is-primary",outlined:!0}],page:1,featureHandler:[],showModal:!1,loading:!1,openedDetailedRows:[]}},created:function(){this.featureHandler.push(this.$on_editButtonClicked),this.$_loadAsyncData()},computed:{selectedQuestionId:function(){var t;return null===(t=this.selectedQuestion)||void 0===t?void 0:t.id},isRowSelected:function(){return null!==this.selectedQuestion},_table:function(){return this.$refs.table}},watch:{questions:function(){this.selectedQuestion=null},searchOptions:function(){this.$_loadAsyncData()}},methods:{$on_rowClicked:function(t){this._table.closeDetailRow(t),this.selectedQuestionId!==t.id?this._table.openDetailRow(t):this.selectedQuestion=null},$on_pageChanged:function(t){this.page=t,this.$_loadAsyncData()},$on_formSubmitted:function(t){var e=this,n=t.success;n&&(this.showModal=!1,this.$nextTick((function(){e.$_loadAsyncData()})))},$_loadAsyncData:function(){var t=this;return Object(u["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.loading=!0,t.$api_findQuestions(Object(o["a"])({page:t.page},t.searchOptions)).then((function(e){var n=e.error,a=e.data;t.loading=t._searching=!1,t.$_resetTableState(),n||t.$_updateData(a)}));case 2:case"end":return e.stop()}}),e)})))()},$_updateData:function(t){var e,n=t.total_count,a=t.results;this.totalCount=n,this.questions.length=0,(e=this.questions).push.apply(e,Object(s["a"])(a.map((function(t,e){return t.id=e+1,t}))))},$on_editButtonClicked:function(){this.showModal=!0},$_resetTableState:function(){this.selectedQuestion&&this._table.closeDetailRow(this.selectedQuestion),this.selectedQuestion=null},$_removeQuestionFromTable:function(t){this.questions=this.questions.filter((function(e){return e.qa_id!==t})),this.totalCount--}}}),c=l,r=(n("7a8a"),n("2877")),d=Object(r["a"])(c,a,i,!1,null,"da4c9350",null);e["default"]=d.exports},"7a8a":function(t,e,n){"use strict";n("289dc")}}]);
//# sourceMappingURL=chunk-56de1e30.8a06a503.js.map