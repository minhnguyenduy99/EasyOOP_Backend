(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2cb60f46"],{"8b6e":function(t,n,e){},"9e5f":function(t,n,e){"use strict";e.r(n);var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"tag-management-page"}},[e("admin-content",{attrs:{title:t.title,icon:"tags",iconPack:"fas"},scopedSlots:t._u([{key:"action",fn:function(){return[e("b-button",{attrs:{"icon-left":"tag",type:"is-primary",outlined:""},on:{click:function(n){t.openTagForm=!0}}},[t._v(" Thêm nhãn dán ")])]},proxy:!0}])},[e("div",{staticClass:"tag-search"},[e("b-input",{staticClass:"tag-search__input is-flex-grow-1",attrs:{icon:"search",size:"is-medium",placeholder:"Tìm kiếm nhãn dán"},nativeOn:{keyup:function(n){return!n.type.indexOf("key")&&t._k(n.keyCode,"enter",13,n.key,"Enter")?null:t.$_searchTags(n)}},model:{value:t.tagSearch,callback:function(n){t.tagSearch=n},expression:"tagSearch"}}),e("b-button",{staticClass:"tag-search__submit",attrs:{size:"is-medium",type:"is-primary"},on:{click:t.$_searchTags}},[t._v("Tìm kiếm")])],1),e("div",{staticClass:"mt-5 ha-vertical-layout-3"},[e("tag-list",{attrs:{headerText:"Nhãn dán câu hỏi",tags:t.questionTags,emptyText:t.emptyText,tagButtonType:function(t){return t.used?"is-danger":"is-primary-dark"}},on:{"tag-clicked":t.$on_selectTag}}),e("tag-list",{attrs:{headerText:"Nhãn dán bài học",tags:t.postTags,emptyText:t.emptyText},on:{"tag-clicked":t.$on_selectTag}})],1)]),e("b-modal",{model:{value:t.openTagForm,callback:function(n){t.openTagForm=n},expression:"openTagForm"}},[e("modal-form",{attrs:{width:"500px","has-card":!0,rounded:"",title:"Tạo nhãn dán",headerClass:"has-background-primary-light has-text-white"}},[e("tag-form",{on:{"tags-created":t.$on_tagsCreated}})],1)],1),e("b-modal",{model:{value:t.openEditTagForm,callback:function(n){t.openEditTagForm=n},expression:"openEditTagForm"}},[e("edit-tag-form",{attrs:{tag:t.selectedTag},on:{"tag-updated":t.$on_tagUpdated,"tag-deleted":t.$on_tagDeleted}})],1)],1)},o=[],i=e("5530"),s=(e("d3b7"),e("3ca3"),e("ddb0"),e("159b"),e("2f62")),c={question:"question",post:"post"},r={name:"TagManagementPage",components:{"admin-content":function(){return e.e("chunk-193a4f2c").then(e.bind(null,"8e2f"))},"tag-list":function(){return e.e("chunk-eb61a6a6").then(e.bind(null,"6587"))},"modal-form":function(){return e.e("chunk-2a303700").then(e.bind(null,"5d04"))},"tag-form":function(){return Promise.all([e.e("chunk-2a303700"),e.e("chunk-932ac754"),e.e("chunk-210ea2fa"),e.e("chunk-072e95f0"),e.e("chunk-12c9d08a")]).then(e.bind(null,"cab4"))},"edit-tag-form":function(){return Promise.all([e.e("chunk-2a303700"),e.e("chunk-932ac754"),e.e("chunk-210ea2fa"),e.e("chunk-072e95f0"),e.e("chunk-17963489")]).then(e.bind(null,"4fed"))}},metaInfo:function(){var t="Quản lí nhãn dán - ".concat(this.$appConfig.VUE_APP_NAME);return{title:t}},inject:["$p_loadPage"],data:function(){return{title:"Quản lí nhãn dán",emptyText:"Không có nhãn dán nào",openTagForm:!1,openEditTagForm:!1,tagSearch:"",questionTags:[],postTags:[],selectedTag:null}},mounted:function(){this.$_searchTags()},methods:Object(i["a"])(Object(i["a"])({},Object(s["b"])("TAG",["searchTag","findTagById"])),{},{$on_selectTag:function(t){this.openEditTagForm=!0,this.selectedTag=t},$on_tagsCreated:function(t){this.openTagForm=!1,console.log(t);var n=t.data,e=n.count,a=n.errors,o=void 0===a?[]:a;this.$_searchTags(),e>0&&this.$_notifySuccess("Tạo nhãn dán thành công.</br>Số lượng: <strong>".concat(e,"</strong>")),o.length>0&&this.$_notifyFormSubmitError(o)},$on_tagUpdated:function(){this.openEditTagForm=!1,this.$_notifySuccess("Cập nhật nhãn dán thành công"),this.$_searchTags()},$on_tagDeleted:function(){this.openEditTagForm=!1,this.$_notifySuccess("Xóa nhãn dán thành công"),this.$_searchTags()},$_searchTags:function(){var t=this;this.$p_loadPage(!0),this.searchTag({value:this.tagSearch}).then((function(n){var e=n.error,a=n.data;t.$p_loadPage(!1),e||t.$_updateTags(a)}))},$_updateTags:function(t){var n=this;this.postTags.length=this.questionTags.length=0,this.postTags=[],this.questionTags=[],this.$nextTick((function(){t.forEach((function(t){t.tag_type===c.question&&n.questionTags.push(t),t.tag_type===c.post&&n.postTags.push(t)}))}))},$_notifySuccess:function(t){this.$buefy.notification.open({duration:2e3,message:t,position:"is-bottom-right",type:"is-success"})},$_notifyFormSubmitError:function(t){var n=this;t.forEach((function(t){n.$buefy.notification.open({duration:2e3,message:"Tạo nhãn dán thất bại. </br>ID: ".concat(t.tag_id),position:"is-bottom-right",type:"is-danger",hasIcon:!0})}))},$_notifyError:function(t){this.$buefy.notification.open({duration:2e3,message:t,position:"is-bottom-right",type:"is-danger",hasIcon:!0})}})},u=r,h=(e("ceeb"),e("2877")),g=Object(h["a"])(u,a,o,!1,null,"0bab1d6c",null);n["default"]=g.exports},ceeb:function(t,n,e){"use strict";e("8b6e")}}]);
//# sourceMappingURL=chunk-2cb60f46.91990fc0.js.map