(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-33990608"],{"1b62":function(t,e,i){"use strict";i.d(e,"e",(function(){return n})),i.d(e,"c",(function(){return r})),i.d(e,"d",(function(){return a})),i.d(e,"a",(function(){return o})),i.d(e,"b",(function(){return u}));i("2c14"),i("a9e3");var n={props:{verification:{verification_id:String,status:Number,post_id:String,author_id:String,post_title:Number,created_date:Number,custom_info:{type:Object,default:{}},manager_id:String,manager:Object,creator:Object}},computed:{managerName:function(){var t,e,i;return null!==(t=null===(e=this.verification)||void 0===e||null===(i=e.manager)||void 0===i?void 0:i.alias)&&void 0!==t?t:"Chưa có"},creatorName:function(){var t,e;return null===(t=this.verification)||void 0===t||null===(e=t.creator)||void 0===e?void 0:e.alias},createdDateInStr:function(){var t;return new Date(null===(t=this.verification)||void 0===t?void 0:t.created_date).toLocaleString("vi",{dateStyle:"full"})}}},r={props:{test:{title:String,limited_time:Number,default_score_per_sentence:Number,sentences:Array}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.test)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.test.limited_time/60)},numberOfSentences:function(){var t;return null===(t=this.test)||void 0===t?void 0:t.sentence_count},totalScore:function(){var t,e=this,i=null===(t=this.test)||void 0===t?void 0:t.sentences;return i.reduce((function(t,i){var n;return t+(0===i.score?null===(n=e.test)||void 0===n?void 0:n.default_score_per_sentence:i.score)}),0)}}},a={props:{testResult:{test_id:String,results:Array,total_score:Number,obtained_score:Number,correct_answer_count:Number,total_sentence_count:Number,limited_time:Number}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.testResult)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.testResult.limited_time/60)}}},s=i("1da1"),o=(i("96cf"),function(t){return{props:{data:{type:Object}},data:function(){return{form:{}}},computed:{validator:function(){return this.$refs[t]},isDataChanged:function(){for(var t in this.form)if(this.data[t]!==this.form[t])return!0;return!1}},methods:{$on_submittedForm:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.validator.validate();case 2:if(i=e.sent,i){e.next=5;break}return e.abrupt("return");case 5:t.validator.reset(),t.$emit("submitted",{validator:t.validator,form:t.form});case 7:case"end":return e.stop()}}),e)})))()}}}}),u={props:{manager:Object},computed:{loginStatus:function(){return 1===this.manager.login_status?"Hoạt động":"Không hoạt động"},loginStatusColor:function(){return 1===this.manager.login_status?"green":"red"},avatar:function(){var t,e;return null===(t=this.manager)||void 0===t||null===(e=t.profile)||void 0===e?void 0:e.profile_pic},joinDate:function(){var t;return new Date(null===(t=this.manager)||void 0===t?void 0:t.created_date).toLocaleDateString("en-GB")}}}},"2c14":function(t,e,i){"use strict";e["a"]={props:{post:{type:Object,default:function(){}}},computed:{createdDateInStr:function(){var t;return new Date(null===(t=this.post)||void 0===t?void 0:t.created_date).toLocaleString("vi",{hour12:!0,dateStyle:"full"})},isActive:function(){var t;return 0===(null===(t=this.post)||void 0===t?void 0:t.post_status)},postStatus:function(){var t;switch(null===(t=this.post)||void 0===t?void 0:t.post_status){case 0:return{text:"Đã duyệt",color:"has-text-success"};case 1:return{text:"Chờ duyệt tạo",color:"has-text-primary"};case 2:return{text:"Chờ duyệt cập nhật",color:"has-text-primary"};case 3:return{text:"Chờ duyệt xóa",color:"has-text-danger"}}return null}}}},"58e8":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.test?i("div",{staticClass:"test-detail card"},[i("div",{staticClass:"card-content"},[i("div",{staticClass:"test-detail-info"},[i("div",{staticClass:"ha-vertical-layout-7"},[i("div",{staticClass:"test-field"},[i("span",{staticClass:"is-size-4 has-text-weight-bold has-text-primary-dark"},[t._v(t._s(t.test.title))])]),i("div",[i("div",{staticClass:"test-field"},[i("span",{staticClass:"test-field-label"},[t._v("Chủ đề: ")]),i("span",{staticClass:"test-field-value"},[t._v(t._s(t.test.topic_title))])]),i("div",{staticClass:"test-field"},[i("span",{staticClass:"test-field-label"},[t._v("Số lượng câu hỏi: ")]),i("span",{staticClass:"test-field-value"},[t._v(t._s(t.numberOfSentences))])]),i("div",{staticClass:"test-field"},[i("span",{staticClass:"test-field-label"},[t._v("Thời gian")]),i("span",{staticClass:"test-field-value"},[t._v(t._s(t.isTimeLimited?t.limitedTimeInMinutes+" phút":"Không giới hạn thời gian"))])])])]),i("hr"),i("div",{staticClass:"notation-container"},t._l(t.COLOR_NOTATIONS,(function(e){return i("div",{key:e.id,staticClass:"notation"},[i("div",{class:["notation-icon","has-background-"+e.color]}),i("span",[t._v(t._s(e.text))])])})),0),t.isOnInit?i("b-button",{staticClass:"has-text-weight-bold",attrs:{name:"start-button",type:"is-primary"},on:{click:function(e){return t.$emit("start")}}},[t._v("Làm bài")]):t._e()],1)])]):t._e()},r=[],a=i("1b62"),s=i("cc7d"),o={name:"TestDetailCard",mixins:[a["c"],Object(s["a"])()],data:function(){return{COLOR_NOTATIONS:[{color:"light",text:"Chưa chọn"},{color:"dark",text:"Đã chọn"},{color:"success",text:"Đáp án đúng"},{color:"danger",text:"Đáp án sai"}]}},methods:{$on_startTestClick:function(){this.$emit("start")}}},u=o,c=(i("b6f8"),i("2877")),l=Object(c["a"])(u,n,r,!1,null,"460d904e",null);e["default"]=l.exports},aa46:function(t,e,i){},b6f8:function(t,e,i){"use strict";i("aa46")}}]);
//# sourceMappingURL=chunk-33990608.329f07ac.js.map