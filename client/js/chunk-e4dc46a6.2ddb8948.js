(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e4dc46a6"],{"11c6":function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.testResult?s("div",{attrs:{id:"test-result-detail-page"}},[s("div",{staticClass:"pt-5 pb-6"},[s("breadcrumb",{attrs:{titles:e.breadCrumbs,active:1,itemClass:"is-size-5"},scopedSlots:e._u([{key:"item",fn:function(t){var n=t.title,a=t.active;return[a?s("a",[s("b-tag",{attrs:{size:"is-medium"}},[e._v(" Result ID: "),s("span",{staticClass:"has-text-weight-bold"},[e._v(e._s(n.value))])])],1):s("router-link",{attrs:{to:n.to}},[e._v(" "+e._s(n.value)+" ")])]}}],null,!1,2380599387)})],1),s("div",{staticClass:"test-detail-container"},[s("div",{staticClass:"ha-vertical-layout-7"},[s("test-detail",{attrs:{testResult:e.testResult}}),s("div",{staticClass:"card"},[s("div",{staticClass:"card-content"},[s("sentence-panel",{attrs:{sentences:e.sentences,selectedOrder:e.selectedOrder,showAnswer:!0,sentencesPerGroup:e.SENTENCES_PER_PAGE,currentPage:e.page,pageCount:e.pageCount}})],1)])],1),s("div",[s("div",{staticClass:"ha-vertical-layout-7",attrs:{id:"sticky-test-info"}},[e.testResult?s("test-result-info",{attrs:{testResult:e.testResult},on:{"order-selected":e.$on_selectedOrderChanged}}):e._e()],1)])])]):e._e()},a=[],i=s("5530"),r=(s("d3b7"),s("3ca3"),s("ddb0"),s("99af"),s("2f62")),u={name:"TestResultDetailPage",components:{breadcrumb:function(){return Promise.resolve().then(s.bind(null,"290e"))},"test-detail":function(){return s.e("chunk-580be31c").then(s.bind(null,"8788"))},"test-result-info":function(){return s.e("chunk-b63f0ba4").then(s.bind(null,"2a20"))},"sentence-panel":function(){return s.e("chunk-2d209b20").then(s.bind(null,"a9c5"))}},inject:["$p_loadPage"],metaInfo:function(){var e,t="".concat(null===(e=this.testResult)||void 0===e?void 0:e.title," | Kết quả bài test - ").concat(this.$appConfig.VUE_APP_NAME);return{title:t,meta:[{property:"og:title",content:t},{property:"og:image",content:"https://res.cloudinary.com/dml8e1w0z/image/upload/v1625112588/oop-learning-helper/white_3_vwauzw.png"}]}},props:{resultId:String},provide:function(){return{$_navigateToPage:this.$_navigatePage.bind(this),SENTENCES_PER_PAGE:this.SENTENCES_PER_PAGE}},data:function(){return{SENTENCES_PER_PAGE:10,testResult:null,sentences:[],selectedOrder:null,page:0,pageCount:0,breadCrumbs:[{value:"Danh sách kết quả",to:{name:"PersonalTestResults"}},{value:this.resultId}]}},mounted:function(){this.$_updateTestResult(),this.$_navigatePage(1)},methods:Object(i["a"])(Object(i["a"])({},Object(r["b"])("VIEWER_TEST",["viewer_getTestResultById","viewer_getDetailOfTestResult"])),{},{$on_selectedOrderChanged:function(e){var t=this,s=Math.ceil(e/this.SENTENCES_PER_PAGE);s!==this.page?this.$_navigatePage(s).then((function(){t.selectedOrder=e})):this.selectedOrder=e},$_updateTestResult:function(){var e=this;this.viewer_getTestResultById({result_id:this.resultId}).then((function(t){var s=t.error,n=t.data;s?e.$router.push({name:"PageNotFound"}):e.testResult=n}))},$_navigatePage:function(e){var t=this;return this.$p_loadPage(!0),this.viewer_getDetailOfTestResult({result_id:this.resultId,page:e}).then((function(e){t.$p_loadPage(!1);var s=e.error,n=e.data;if(!s){var a=n.results,i=n.page,r=n.page_count;t.sentences.length=0,t.sentences=a,t.page=i,t.pageCount=r}}))}})},l=u,c=(s("d01e"),s("2877")),o=Object(c["a"])(l,n,a,!1,null,"79e40831",null);t["default"]=o.exports},"7b8d":function(e,t,s){},d01e:function(e,t,s){"use strict";s("7b8d")}}]);
//# sourceMappingURL=chunk-e4dc46a6.2ddb8948.js.map