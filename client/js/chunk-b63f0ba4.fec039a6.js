(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b63f0ba4"],{2112:function(t,e,n){"use strict";n("baf9")},"2a20":function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"panel is-primary-light test-result-info"},[n("p",{staticClass:"panel-heading has-text-centered"},[t._v(" KẾT QUẢ ")]),n("div",{staticClass:"p-3 ha-vertical-layout-6"},[n("div",{staticClass:"ha-vertical-layout-6 py-3"},[n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Số lượng câu đúng ")]),n("span",{staticClass:"test-field-value"},[t._v(t._s(t.correctSentenceText))])]),n("div",{staticClass:"test-field"},[n("span",{staticClass:"test-field-label"},[t._v("Số điểm đạt được ")]),n("span",{staticClass:"test-field-value"},[t._v(t._s(t.obtainedScoreText))])])]),n("hr"),n("sentence-order-panel",{attrs:{answers:t.testResult.results,buttonType:t.$_buttonTypeHandler},on:{selected:t.$on_sentenceSelected}})],1)])},a=[],c=(n("d3b7"),n("3ca3"),n("ddb0"),n("a9e3"),n("99af"),{name:"TestResultInfo",components:{"sentence-order-panel":function(){return n.e("chunk-3fa8713e").then(n.bind(null,"a549"))}},inject:["$_navigateToPage","$p_showLoginModal"],props:{testResult:{type:Object,default:function(){return null}},page:Number,pageCount:Number},data:function(){return{showLoginModal:!1}},computed:{correctSentenceText:function(){var t=this.testResult,e=t.total_sentence_count,n=t.correct_answer_count;return"".concat(n," / ").concat(e)},obtainedScoreText:function(){var t=this.testResult,e=t.obtained_score,n=t.total_score;return"".concat(e," / ").concat(n)}},methods:{$on_sentenceSelected:function(t){this.$emit("order-selected",t)},$_buttonTypeHandler:function(t,e){var n=t.answer,s=t.user_answer;return-1===s?"is-light":n===s?"is-success":"is-danger"}}}),l=c,i=(n("2112"),n("2877")),o=Object(i["a"])(l,s,a,!1,null,"2144627e",null);e["default"]=o.exports},baf9:function(t,e,n){}}]);
//# sourceMappingURL=chunk-b63f0ba4.fec039a6.js.map