(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-580be31c"],{"1b62":function(t,e,i){"use strict";i.d(e,"c",(function(){return n})),i.d(e,"d",(function(){return s})),i.d(e,"a",(function(){return a})),i.d(e,"b",(function(){return u}));i("a9e3");var n={props:{test:{title:String,limited_time:Number,default_score_per_sentence:Number,sentences:Array}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.test)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.test.limited_time/60)},numberOfSentences:function(){var t;return null===(t=this.test)||void 0===t?void 0:t.sentence_count},totalScore:function(){var t,e=this,i=null===(t=this.test)||void 0===t?void 0:t.sentences;return i.reduce((function(t,i){var n;return t+(0===i.score?null===(n=e.test)||void 0===n?void 0:n.default_score_per_sentence:i.score)}),0)}}},s={props:{testResult:{test_id:String,results:Array,total_score:Number,obtained_score:Number,correct_answer_count:Number,total_sentence_count:Number,limited_time:Number}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.testResult)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.testResult.limited_time/60)}}},r=i("1da1"),a=(i("96cf"),function(t){return{props:{data:{type:Object}},data:function(){return{form:{}}},computed:{validator:function(){return this.$refs[t]},isDataChanged:function(){for(var t in this.form)if(this.data[t]!==this.form[t])return!0;return!1}},methods:{$on_submittedForm:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.validator.validate();case 2:if(i=e.sent,i){e.next=5;break}return e.abrupt("return");case 5:t.validator.reset(),t.$emit("submitted",{validator:t.validator,form:t.form});case 7:case"end":return e.stop()}}),e)})))()}}}}),u={props:{manager:Object},computed:{loginStatus:function(){return 1===this.manager.login_status?"Hoạt động":"Không hoạt động"},loginStatusColor:function(){return 1===this.manager.login_status?"green":"red"},avatar:function(){var t,e;return null===(t=this.manager)||void 0===t||null===(e=t.profile)||void 0===e?void 0:e.profile_pic},joinDate:function(){var t;return new Date(null===(t=this.manager)||void 0===t?void 0:t.created_date).toLocaleDateString("en-GB")}}}},"632f":function(t,e,i){"use strict";i("9bea")},8788:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.testResult?i("div",{staticClass:"test-detail card"},[i("div",{staticClass:"card-content"},[i("div",{staticClass:"test-detail-info"},[i("div",{staticClass:"ha-vertical-layout-7"},[i("div",{staticClass:"test-field"},[i("span",{staticClass:"is-size-4 has-text-weight-bold has-text-primary-dark"},[t._v(t._s(t.testResult.title))])])]),i("hr"),i("div",[i("div",{staticClass:"test-field"},[i("span",{staticClass:"test-field-label"},[t._v("Số lượng câu hỏi: ")]),i("span",{staticClass:"test-field-value"},[t._v(t._s(t.testResult.total_sentence_count))])]),i("div",{staticClass:"test-field"},[i("span",{staticClass:"test-field-label"},[t._v("Thời gian")]),i("span",{staticClass:"test-field-value"},[t._v(t._s(t.isTimeLimited?t.limitedTimeInMinutes+" phút":"Không giới hạn thời gian"))])])])])])]):t._e()},s=[],r=i("1b62"),a={name:"TestDetailCard",mixins:[r["d"]],data:function(){return{}}},u=a,o=(i("632f"),i("2877")),l=Object(o["a"])(u,n,s,!1,null,"0872d95c",null);e["default"]=l.exports},"9bea":function(t,e,i){}}]);
//# sourceMappingURL=chunk-580be31c.92ee413d.js.map