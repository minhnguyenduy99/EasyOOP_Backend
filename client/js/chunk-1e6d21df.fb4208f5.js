(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e6d21df"],{"19b7":function(t,e,i){"use strict";i("fe58")},"21b2":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"post-verification-page"}},[i("admin-content",{attrs:{title:"Duyệt bài viết",icon:"file-signature",iconPack:"fas","content-class":"p-0"}},[i("div",{attrs:{id:"page-main-content"}},[i("div",{attrs:{id:"detailted-verification-container"}},[i("div",{staticClass:"px-3 pt-5"},[i("verification-search",{on:{search:t.$on_search}})],1),i("section",{staticClass:"px-3 py-5"},[i("b-tabs",{staticClass:"is-paddingless",attrs:{id:"pending-post-tabs",position:"is-centered",animated:!1},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[i("b-tab-item",{scopedSlots:t._u([{key:"header",fn:function(){return[i("div",{staticClass:"tab-header"},[i("b-icon",{attrs:{icon:"check",type:"is-success"}}),i("span",{staticClass:"tab-header-title"},[t._v(" "+t._s(t.TAB_STATUS_MAPS[0].text)+" "),i("b-tag",{attrs:{rounded:""}},[t._v(" "+t._s(t.TAB_STATUS_MAPS[0].count)+" ")])],1)],1)]},proxy:!0}])},[i("div"),[i("verification-table",{attrs:{active:0===t.activeTab,type:2,"search-options":t.searchOptions},on:{selected:t.$on_verificationSelected}})]],2),i("b-tab-item",{scopedSlots:t._u([{key:"header",fn:function(){return[i("div",{staticClass:"tab-header"},[i("b-icon",{attrs:{icon:"spinner"}}),i("span",{staticClass:"tab-header-title"},[t._v(" "+t._s(t.TAB_STATUS_MAPS[1].text)+" "),i("b-tag",{attrs:{type:"is-light",rounded:""}},[t._v(" "+t._s(t.TAB_STATUS_MAPS[1].count)+" ")])],1)],1)]},proxy:!0}])},[[i("verification-table",{attrs:{active:1===t.activeTab,type:1,"search-options":t.searchOptions},on:{selected:t.$on_verificationSelected}})]],2),i("b-tab-item",{scopedSlots:t._u([{key:"header",fn:function(){return[i("div",{staticClass:"tab-header"},[i("b-icon",{attrs:{icon:"minus",type:"is-danger"}}),i("span",{staticClass:"tab-header-title"},[t._v(" "+t._s(t.TAB_STATUS_MAPS[2].text)+" "),i("b-tag",{attrs:{rounded:""}},[t._v(" "+t._s(t.TAB_STATUS_MAPS[2].count)+" ")])],1)],1)]},proxy:!0}])},[[i("verification-table",{attrs:{active:2===t.activeTab,type:0,"search-options":t.searchOptions},on:{selected:t.$on_verificationSelected}})]],2)],1),i("b-loading",{attrs:{"is-full-page":!1},model:{value:t.isSearching,callback:function(e){t.isSearching=e},expression:"isSearching"}})],1)]),i("section",{staticClass:"card",attrs:{id:"latest-submitted-section"}},[i("div",{staticClass:"card-content p-0"},[t.selectedVerification?i("b-tabs",{staticClass:"is-paddingless",attrs:{id:"post-detail-tabs",type:"is-toggle"}},[i("b-tab-item",{attrs:{label:"Duyệt"}},[i("verification-info",{attrs:{verification:t.selectedVerification}})],1),t.selectedPost?i("b-tab-item",{attrs:{label:"Bài viết"}},[i("post-info",{attrs:{post:t.selectedPost}})],1):t._e()],1):i("div",{staticClass:"p-3 is-flex is-justify-content-center"},[i("span",{staticClass:"is-size-4 has-text-grey-light has-text-weight-medium"},[t._v("Bạn chưa chọn bài viết")])])],1)])])]),i("b-modal",{attrs:{scroll:"keep"},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[i("div",{staticClass:"card is-page-responsive py-6"},[t.selectedPost?i("post-view-detail",{attrs:{post:t.selectedPost,trigger:!1}}):t._e()],1)])],1)},n=[],s=i("5530"),c=(i("d3b7"),i("3ca3"),i("ddb0"),i("159b"),i("2f62")),o={name:"PostVerificationPage",components:{"admin-content":function(){return i.e("chunk-193a4f2c").then(i.bind(null,"8e2f"))},"verification-search":function(){return i.e("chunk-1c734e6e").then(i.bind(null,"b056"))},"verification-table":function(){return i.e("chunk-f59cc848").then(i.bind(null,"b2ee"))},"post-info":function(){return i.e("chunk-1a1892e1").then(i.bind(null,"fcd3"))},"verification-info":function(){return i.e("chunk-000c998f").then(i.bind(null,"3a91"))},"post-view-detail":function(){return i.e("chunk-1a173d48").then(i.bind(null,"d504"))}},metaInfo:function(){var t="Quản lí bài duyệt - ".concat(this.$appConfig.VUE_APP_NAME);return{title:t}},provide:function(){return{manager_getPendingVerifications:this.manager_getPendingVerifications,manager_findVerifications:this.manager_findVerifications,getPostById:this.getPostById,manager_verify:this.manager_verify,manager_unverify:this.manager_unverify,previewSelectedPost:this.$_previewSelectedPost}},data:function(){return{VERIFICATION_STATUSES:{UNVERIFIED:0,VERIFIED:1,PENDING:2,CANCEL:3},TAB_STATUS_MAPS:[{status:2,text:"Chờ duyệt ",count:0},{status:1,text:"Đã duyệt",count:0},{status:0,text:"Không được duyệt ",count:0}],activeTab:-1,searchOptions:{},isSearching:!1,selectedVerification:null,selectedPost:null,showModal:!1}},watch:{activeTab:function(t){this.$_updateTabInfo()}},computed:{selectedContentFileUrl:function(){var t,e;return null!==(t=null===(e=this.selectedPost)||void 0===e?void 0:e.content_file_url)&&void 0!==t?t:null}},methods:Object(s["a"])(Object(s["a"])({},Object(c["b"])("POST",["manager_getPendingVerifications","manager_findVerifications","manager_getGroupSummary","manager_verify","manager_unverify","manager_getPostById"])),{},{$on_search:function(t){this.searchOptions=t},$on_verificationSelected:function(t){var e=this;if(this.selectedVerification=t,t&&t.status!==this.VERIFICATION_STATUSES.UNVERIFIED){var i=t.status===this.VERIFICATION_STATUSES.VERIFIED;this.manager_getPostById({post_id:t.post_id,active:i}).then((function(t){var i=t.error,a=t.data;i||(e.selectedPost=a)}))}else this.selectedPost=null},$_reloadTab:function(){this.isSearching=!0},$_updateTabInfo:function(){var t=this;this.$on_verificationSelected(null),this.manager_getGroupSummary().then((function(e){var i=e.error,a=e.data;i||t.TAB_STATUS_MAPS.forEach((function(t){var e,i=a[t.status];t.count=null!==(e=null===i||void 0===i?void 0:i.count)&&void 0!==e?e:0}))}))},$_previewSelectedPost:function(){this.showModal=!0}})},r=o,d=(i("19b7"),i("2877")),l=Object(d["a"])(r,a,n,!1,null,"1f6a6eb2",null);e["default"]=l.exports},fe58:function(t,e,i){}}]);
//# sourceMappingURL=chunk-1e6d21df.fb4208f5.js.map