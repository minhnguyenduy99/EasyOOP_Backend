(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0abc0bcf"],{"264e":function(t,e,n){},affd:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.test?n("div",{attrs:{id:"test-detail-page"}},[n("div",{staticClass:"test-detail-container"},[n("div",{staticClass:"ha-vertical-layout-7"},[n("test-detail",{attrs:{test:t.test,state:t.state},on:{start:t.$on_testStarted}}),n("div",{staticClass:"card"},[n("div",{staticClass:"card-content"},[t.isOnProgress?n("sentence-panel",{attrs:{sentences:t.sentences,selectedOrder:t.selectedOrder,sentencesPerGroup:t.sentencesPerGroup,currentAnswerGroup:t.currentAnswerGroup,currentPage:t.currentPage,pageCount:t.pageCount}}):t.isFinished?n("sentence-panel",{attrs:{sentences:t.sentences,showAnswer:!0,selectedOrder:t.selectedOrder,sentencesPerGroup:t.sentencesPerGroup,currentAnswerGroup:t.currentAnswerGroup,currentPage:t.currentPage,pageCount:t.pageCount}}):t._e()],1)])],1),n("div",[n("div",{staticClass:"ha-vertical-layout-7",attrs:{id:"sticky-test-info"}},[t.isFinished?t.testResult?n("test-result-info",{attrs:{testResult:t.testResult,state:t.state,selectedOrder:t.selectedOrder},on:{"update:selectedOrder":function(e){t.selectedOrder=e},"update:selected-order":function(e){t.selectedOrder=e},"result-saved":function(e){t.resultSaved=!0}}}):t._e():n("test-session-info",{attrs:{test:t.test,state:t.state,selectedOrder:t.selectedOrder},on:{"update:selectedOrder":function(e){t.selectedOrder=e},"update:selected-order":function(e){t.selectedOrder=e}}})],1)])])]):t._e()},r=[],i=n("1da1"),a=n("5530"),o=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("99af"),n("2b0e")),u=n("2f62"),c=n("cc7d"),d={name:"TestDetailPage",components:{"test-detail":function(){return n.e("chunk-937cb82e").then(n.bind(null,"58e8"))},"test-session-info":function(){return n.e("chunk-1a40259a").then(n.bind(null,"1d3c"))},"test-result-info":function(){return Promise.all([n.e("chunk-785f9ee4"),n.e("chunk-5537ccd2")]).then(n.bind(null,"0354"))},"sentence-panel":function(){return n.e("chunk-2d209b20").then(n.bind(null,"a9c5"))}},mixins:[Object(c["b"])(o["default"])],inject:["$p_loadPage"],metaInfo:function(){var t,e="Làm bài test: ".concat(null===(t=this.test)||void 0===t?void 0:t.title," - ").concat(this.$appConfig.VUE_APP_NAME);return{title:e,meta:[{property:"og:title",content:e},{property:"og:image",content:"https://res.cloudinary.com/dml8e1w0z/image/upload/v1625112588/oop-learning-helper/white_3_vwauzw.png"}]}},props:{testId:String,sessionId:String},provide:function(){return{$_navigateToPage:this.$_navigatePage.bind(this)}},data:function(){return{TEST_SESSION_STATES:{INIT:0,ON_PROGRESS:1,FINISHED:2},SENTENCES_PER_PAGE:10,test:null,testResult:null,sentences:[],selectedOrder:null,routeTo:null,resultSaved:!1,isSentencePanelLoading:!1}},created:function(){var t=this;this.$_updateTest().then((function(){t.sessionId&&t.$_navigatePage(1)}))},mounted:function(){if(this.$_registerWindowUnloadEvent(),this.sessionId)return this.$on("session-ended",this.$_getTestResultBySession),void this.$endSession();this.$on("session-ended",this.$on_sessionEnd)},beforeDestroy:function(){this.$_unregisterWindowUnloadEvent()},beforeRouteLeave:function(t,e,n){this.routeTo||this.isOnInit||this.resultSaved?n():(this.routeTo=t,this.$_callDialogConfirmForRouteChange())},watch:{testId:function(){var t=this;this.state=this.TEST_SESSION_STATES.INIT,this.$_updateTest().then((function(){t.sessionId&&t.$_navigatePage(1)}))}},computed:Object(a["a"])({},Object(u["c"])("VIEWER_TEST",["sentencesPerGroup","currentAnswerGroup","currentPage","pageCount","totalAnswers"])),methods:Object(a["a"])(Object(a["a"])({},Object(u["b"])("VIEWER_TEST",["getTestById","viewer_createTestResult","getTestResultBySessionId","navigateToPage"])),{},{$_updateTest:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",t.getTestById(t.testId).then((function(e){var n=e.error,s=e.data;n?t.$router.push({name:"PageNotFound"}):t.test=s})));case 1:case"end":return e.stop()}}),e)})))()},$_navigatePage:function(t){var e=this;return this.$p_loadPage(!0),this.navigateToPage({page:t}).then((function(t){e.$p_loadPage(!1);var n=t.error,s=t.data;if(!n){var r=s.results;e.sentences.length=0,e.sentences=r}}))},$on_testStarted:function(){this.$startSession(),this.$_navigatePage(1)},$on_sessionEnd:function(){var t=this;this.viewer_createTestResult({test_id:this.testId,results:this.totalAnswers,save:!1}).then((function(e){var n=e.error,s=e.data;if(!n){var r=s.data;t.testResult=r,t.$_navigatePage(1)}}))},$_getTestResultBySession:function(){var t=this;this.getTestResultBySessionId(this.sessionId).then((function(e){var n=e.error,s=e.data;if(n)t.$router.push({name:"PageNotFound"});else{var r=s.data;r.test_id!==t.testId&&t.$router.push({name:"Home"}),t.testResult=r}}))},$_registerWindowUnloadEvent:function(){window.addEventListener("beforeunload",this.$_setupConfirmDialog)},$_unregisterWindowUnloadEvent:function(){window.removeEventListener("beforeunload",this.$_setupConfirmDialog)},$_setupConfirmDialog:function(t){if(!this.isOnInit&&!this.resultSaved)return t.preventDefault(),t.returnValue="Bạn muốn rời trang này ?","Bạn muốn rời trang này ?"},$_callDialogConfirmForRouteChange:function(){var t=this;this.$buefy.dialog.confirm({title:"CHUYỂN TRANG",message:"Bạn còn đang trong tình trạng làm bài hoặc chưa lưu kết quả<br /><strong>Bạn chắc chắn muốn rời khỏi trang này ?</strong>",confirmText:"Rời trang",cancelText:"Ở lại",type:"is-danger",hasIcon:!0,onConfirm:function(){return t.$router.push(t.routeTo)},onCancel:function(){return t.routeTo=null}})}})},S=d,l=(n("b356"),n("2877")),h=Object(l["a"])(S,s,r,!1,null,"0e471044",null);e["default"]=h.exports},b356:function(t,e,n){"use strict";n("264e")},cc7d:function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return r}));n("a9e3");var s=function(){return{inject:["$startSession","$endSession","TEST_SESSION_STATES"],props:{state:Number},computed:{isOnInit:function(){return this.state===this.TEST_SESSION_STATES.INIT},isOnProgress:function(){return this.state===this.TEST_SESSION_STATES.ON_PROGRESS},isFinished:function(){return this.state===this.TEST_SESSION_STATES.FINISHED}}}},r=function(t){return{provide:function(){return{$startSession:this.$startSession.bind(this),$endSession:this.$endSession.bind(this),TEST_SESSION_STATES:this.TEST_SESSION_STATES}},data:function(){return{TEST_SESSION_STATES:{INIT:0,ON_PROGRESS:1,FINISHED:2},state:0}},computed:{isOnInit:function(){return this.state===this.TEST_SESSION_STATES.INIT},isOnProgress:function(){return this.state===this.TEST_SESSION_STATES.ON_PROGRESS},isFinished:function(){return this.state===this.TEST_SESSION_STATES.FINISHED}},methods:{$getState:function(){return this.state},$startSession:function(){this.state=this.TEST_SESSION_STATES.ON_PROGRESS},$endSession:function(){this.state=this.TEST_SESSION_STATES.FINISHED,this.$emit("session-ended")}}}}}}]);
//# sourceMappingURL=chunk-0abc0bcf.51101fc2.js.map