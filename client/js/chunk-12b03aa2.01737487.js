(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-12b03aa2"],{"1b62":function(t,e,i){"use strict";i.d(e,"c",(function(){return n})),i.d(e,"d",(function(){return a})),i.d(e,"a",(function(){return r})),i.d(e,"b",(function(){return o}));i("a9e3");var n={props:{test:{title:String,limited_time:Number,default_score_per_sentence:Number,sentences:Array}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.test)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.test.limited_time/60)},numberOfSentences:function(){var t;return null===(t=this.test)||void 0===t?void 0:t.sentence_count},totalScore:function(){var t,e=this,i=null===(t=this.test)||void 0===t?void 0:t.sentences;return i.reduce((function(t,i){var n;return t+(0===i.score?null===(n=e.test)||void 0===n?void 0:n.default_score_per_sentence:i.score)}),0)}}},a={props:{testResult:{test_id:String,results:Array,total_score:Number,obtained_score:Number,correct_answer_count:Number,total_sentence_count:Number,limited_time:Number}},computed:{isTimeLimited:function(){var t;return 1===(null===this||void 0===this||null===(t=this.testResult)||void 0===t?void 0:t.type)},limitedTimeInMinutes:function(){return Math.floor(this.testResult.limited_time/60)}}},s=i("1da1"),r=(i("96cf"),function(t){return{props:{data:{type:Object}},data:function(){return{form:{}}},computed:{validator:function(){return this.$refs[t]},isDataChanged:function(){for(var t in this.form)if(this.data[t]!==this.form[t])return!0;return!1}},methods:{$on_submittedForm:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.validator.validate();case 2:if(i=e.sent,i){e.next=5;break}return e.abrupt("return");case 5:t.validator.reset(),t.$emit("submitted",{validator:t.validator,form:t.form});case 7:case"end":return e.stop()}}),e)})))()}}}}),o={props:{manager:Object},computed:{loginStatus:function(){return 1===this.manager.login_status?"Hoạt động":"Không hoạt động"},loginStatusColor:function(){return 1===this.manager.login_status?"green":"red"},avatar:function(){var t,e;return null===(t=this.manager)||void 0===t||null===(e=t.profile)||void 0===e?void 0:e.profile_pic},joinDate:function(){var t;return new Date(null===(t=this.manager)||void 0===t?void 0:t.created_date).toLocaleDateString("en-GB")}}}},"3d9d":function(t,e,i){"use strict";i("6525")},6525:function(t,e,i){},d5c2:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"manager-info"},[i("div",{staticClass:"avatar-wrapper"},[i("b-image",{staticClass:"manager-info--avatar",attrs:{ratio:"1by1",src:t.avatar,rounded:""}})],1),i("div",{staticClass:"is-flex is-flex-direction-column py-3 is-align-items-center"},[i("span",{staticClass:"is-size-5 has-text-weight-bold"},[t._v(t._s(t.manager.profile.display_name))]),i("span",{staticClass:"mt-1 mr-1 is-italic"},[t._v("("+t._s(t.manager.alias)+")")])]),i("div",{staticClass:"manager-info-detail py-3"},[i("b-tabs",{attrs:{type:"is-boxed"},model:{value:t.activeIndex,callback:function(e){t.activeIndex=e},expression:"activeIndex"}},[i("b-tab-item",{scopedSlots:t._u([{key:"header",fn:function(){return[i("span",{staticClass:"has-text-weight-bold has-text-grey"},[t._v("Thông tin")])]},proxy:!0}])},[i("div",{staticClass:"field-info-group"},[i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("User ID")]),i("div",{staticClass:"field-info-value"},[t._v(" "+t._s(t.manager.user_id)+" ")])]),i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("Ngày tham gia")]),i("div",{staticClass:"field-info-value"},[t._v(" "+t._s(t.joinDate)+" ")])]),i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("Tình trạng hoạt động")]),i("div",{staticClass:"field-info-value has-text-weight-bold",style:{color:t.loginStatusColor}},[t._v(" "+t._s(t.loginStatus)+" ")])])])])],1)],1)])},a=[],s=i("1b62"),r={name:"ManagerInfo",mixins:[s["b"]],data:function(){return{activeIndex:0}}},o=r,u=(i("3d9d"),i("2877")),l=Object(u["a"])(o,n,a,!1,null,"19e0b6c6",null);e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-12b03aa2.01737487.js.map