(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a40259a"],{"0ccb":function(t,e,n){var i=n("50c4"),s=n("1148"),a=n("1d80"),c=Math.ceil,r=function(t){return function(e,n,r){var o,l,u=String(a(e)),d=u.length,f=void 0===r?" ":String(r),h=i(n);return h<=d||""==f?u:(o=h-d,l=s.call(f,c(o/f.length)),l.length>o&&(l=l.slice(0,o)),t?u+l:l+u)}};t.exports={start:r(!1),end:r(!0)}},1148:function(t,e,n){"use strict";var i=n("a691"),s=n("1d80");t.exports="".repeat||function(t){var e=String(s(this)),n="",a=i(t);if(a<0||a==1/0)throw RangeError("Wrong number of repetitions");for(;a>0;(a>>>=1)&&(e+=e))1&a&&(n+=e);return n}},"1d3c":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"panel is-primary-light"},[n("p",{staticClass:"panel-heading has-text-centered"},[t._v(" THÔNG TIN BÀI TEST ")]),n("div",{staticClass:"p-5 ha-vertical-layout-5"},[t.isFinished?n("div",{staticClass:"ha-vertical-layout-6"},[n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Số lượng câu đúng ")]),n("span",{staticClass:"test-field-value"},[t._v(t._s(t.correctSentenceText))])]),n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Số điểm đạt được ")]),n("span",{staticClass:"test-field-value"},[t._v(t._s(t.obtainedScoreText))])])]):n("div",{staticClass:"is-flex is-flex-direction-column ha-vertical-layout-6"},[n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Thời gian còn lại")]),t.isTimeLimited?n("span",{staticClass:"test-field-value"},[t._v(t._s(t.expired?t.expiredMessage:t.formattedDueTime))]):n("span",{staticClass:"test-field-value"},[t._v("Không giới hạn")])]),n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Số câu còn lại")]),n("span",{staticClass:"test-field-value"},[t._v(t._s(t.unansweredSentenceCount))])]),t.isOnProgress?n("b-button",{staticClass:"is-align-self-flex-end",attrs:{type:"is-danger"},on:{click:t.$on_submitButtonClicked}},[t._v("Nộp bài")]):t._e()],1),n("hr"),n("sentence-order-panel",{attrs:{disabled:!t.isOnProgress,answers:t.totalAnswers},on:{selected:t.$on_sentenceSelected}})],1)])},s=[],a=n("5530"),c=(n("d3b7"),n("3ca3"),n("ddb0"),n("a9e3"),n("4de4"),n("25f0"),n("4d90"),n("99af"),n("2f62")),r=n("cc7d"),o={name:"TestSessionInfo",components:{"sentence-order-panel":function(){return n.e("chunk-3fa8713e").then(n.bind(null,"a549"))}},mixins:[Object(r["a"])()],inject:["$_navigateToPage"],props:{test:{type:Object,default:function(){return null}},selectedOrder:Number},data:function(){return{timer:null,dueTime:0,expired:!1}},mounted:function(){this.test&&(this.dueTime=this.test.limited_time)},watch:{test:function(t){t&&(this.dueTime=this.test.limited_time)},state:function(t){t&&this.$_startTimer()}},computed:Object(a["a"])(Object(a["a"])({},Object(c["c"])("VIEWER_TEST",["answerGroups","sentencesPerGroup","pageOfSentence","currentPage","totalAnswers"])),{},{numberOfSentences:function(){var t;return null===(t=this.test)||void 0===t?void 0:t.sentence_count},unansweredSentenceCount:function(){return this.totalAnswers.filter((function(t){return!t.answered})).length},expiredMessage:function(){return"Hết thời gian"},isTimeLimited:function(){return 1===this.test.type},formattedDueTime:function(){var t=Math.floor(this.dueTime/3600),e=Math.floor((this.dueTime-3600*t)/60),n=this.dueTime-3600*t-60*e;return t.toString()+":"+e.toString().padStart(2,"0")+":"+n.toString().padStart(2,"0")},correctSentenceText:function(){var t=this.testResult,e=t.total_sentence_count,n=t.correct_answer_count;return"".concat(n," / ").concat(e)},obtainedScoreText:function(){var t=this.testResult,e=t.obtained_score,n=t.total_score;return"".concat(e," / ").concat(n)}}),methods:{$on_submitButtonClicked:function(){var t=this;this.$buefy.dialog.confirm({title:"Nộp bài",message:"Bạn chắc chắc muốn nộp ?</br>Bạn vẫn còn <b>".concat(this.unansweredSentenceCount,"</b> câu chưa trả lời"),cancelText:"Hủy",confirmText:"Nộp bài",type:"is-danger",hasIcon:!0,icon:"times-circle",iconPack:"fa",onConfirm:function(){t.$_finishTest()}})},$on_sentenceSelected:function(t){var e=this,n=this.pageOfSentence(t);n!==this.currentPage?this.$_navigateToPage(n).then((function(){e.$nextTick((function(){e.$emit("update:selectedOrder",t)}))})):this.$emit("update:selectedOrder",t)},$_startTimer:function(){var t=this;this.isTimeLimited&&(this.timer=setInterval((function(){t.dueTime--,t.$nextTick((function(){55===t.dueTime&&t.$_finishTest()}))}),1e3))},$_finishTest:function(){clearInterval(this.timer),this.timer=null,this.$endSession()}}},l=o,u=(n("32d1"),n("2877")),d=Object(u["a"])(l,i,s,!1,null,"05d25040",null);e["default"]=d.exports},"25f0":function(t,e,n){"use strict";var i=n("6eeb"),s=n("825a"),a=n("d039"),c=n("ad6d"),r="toString",o=RegExp.prototype,l=o[r],u=a((function(){return"/a/b"!=l.call({source:"a",flags:"b"})})),d=l.name!=r;(u||d)&&i(RegExp.prototype,r,(function(){var t=s(this),e=String(t.source),n=t.flags,i=String(void 0===n&&t instanceof RegExp&&!("flags"in o)?c.call(t):n);return"/"+e+"/"+i}),{unsafe:!0})},"32d1":function(t,e,n){"use strict";n("86f6")},"4d90":function(t,e,n){"use strict";var i=n("23e7"),s=n("0ccb").start,a=n("9a0c");i({target:"String",proto:!0,forced:a},{padStart:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}})},"86f6":function(t,e,n){},"9a0c":function(t,e,n){var i=n("342f");t.exports=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(i)}}]);
//# sourceMappingURL=chunk-1a40259a.365600b7.js.map