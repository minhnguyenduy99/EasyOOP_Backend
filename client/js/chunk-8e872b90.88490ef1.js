(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8e872b90"],{"8c8d":function(t,a,i){"use strict";i.r(a);var e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"creator-info"},[i("div",{staticClass:"avatar-wrapper"},[i("b-image",{staticClass:"creator-info--avatar",attrs:{ratio:"1by1",src:t.avatar,rounded:""}})],1),i("div",{staticClass:"is-flex is-flex-direction-column py-3 is-align-items-center"},[i("span",{staticClass:"is-size-5 has-text-weight-bold"},[t._v(t._s(t.creator.profile.display_name))]),i("span",{staticClass:"mt-1 mr-1 is-italic"},[t._v("("+t._s(t.creator.alias)+")")])]),i("div",{staticClass:"creator-info-detail py-3"},[i("b-tabs",{attrs:{type:"is-boxed"},model:{value:t.activeIndex,callback:function(a){t.activeIndex=a},expression:"activeIndex"}},[i("b-tab-item",{scopedSlots:t._u([{key:"header",fn:function(){return[i("span",{staticClass:"has-text-weight-bold has-text-grey"},[t._v("Thông tin")])]},proxy:!0}])},[i("div",{staticClass:"field-info-group"},[i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("User ID")]),i("div",{staticClass:"field-info-value"},[t._v(" "+t._s(t.creator.user_id)+" ")])]),i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("Ngày tham gia")]),i("div",{staticClass:"field-info-value"},[t._v(" "+t._s(t.joinDate)+" ")])]),i("div",{staticClass:"field-info"},[i("div",{staticClass:"field-info-label"},[t._v("Tình trạng hoạt động")]),i("div",{staticClass:"field-info-value has-text-weight-bold",style:{color:t.loginStatusColor}},[t._v(" "+t._s(t.loginStatus)+" ")])])])])],1)],1)])},s=[],n={props:{creator:Object},computed:{loginStatus:function(){return 1===this.creator.login_status?"Hoạt động":"Không hoạt động"},loginStatusColor:function(){return 1===this.creator.login_status?"green":"red"},avatar:function(){var t,a;return null===(t=this.creator)||void 0===t||null===(a=t.profile)||void 0===a?void 0:a.profile_pic},joinDate:function(){var t;return new Date(null===(t=this.creator)||void 0===t?void 0:t.created_date).toLocaleDateString("en-GB")}}},o={name:"CreatorInfo",mixins:[n],data:function(){return{activeIndex:0}}},l=o,r=(i("eb8f"),i("2877")),c=Object(r["a"])(l,e,s,!1,null,"2bc6dfa2",null);a["default"]=c.exports},ea0e:function(t,a,i){},eb8f:function(t,a,i){"use strict";i("ea0e")}}]);
//# sourceMappingURL=chunk-8e872b90.88490ef1.js.map