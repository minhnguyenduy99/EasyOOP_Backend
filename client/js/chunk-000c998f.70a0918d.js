(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-000c998f"],{"0514":function(t,i,n){"use strict";n.d(i,"a",(function(){return s})),n.d(i,"c",(function(){return a})),n.d(i,"b",(function(){return e}));var s=[{status:-1,title:"Chọn tất cả"},{status:1,title:"Duyệt tạo",icon:"circle",type:"is-danger"},{status:2,title:"Duyệt cập nhật",icon:"circle",type:"is-danger"},{status:3,title:"Duyệt xóa",icon:"circle",type:"is-danger"}],a=[{text:"Chọn loại duyệt",value:null},{text:"Duyệt tạo",value:"1"},{text:"Duyệt cập nhật",value:"2"},{text:"Duyệt xóa",value:"3"}],e=[{text:"Không được duyệt",color:"has-text-danger"},{text:"Đã duyệt",color:"has-text-success"},{text:"Đang chờ",color:"has-text-primary-dark"},{text:"Đã hủy",color:"has-text-grey"}]},"078c":function(t,i,n){"use strict";n("4a99")},"3a91":function(t,i,n){"use strict";n.r(i);var s=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"verification-info"},[n("div",{staticClass:"px-3 py-3"},[n("div",{staticClass:"info-container"},[n("div",{staticClass:"info-field"},[n("span",{staticClass:"info-field--label"},[t._v("Tình trạng duyệt")]),n("span",{class:["info-field--value","has-text-weight-bold",t.status.color]},[t._v(t._s(t.status.text))])]),n("div",{staticClass:"info-field"},[n("span",{staticClass:"info-field--label"},[t._v("Tác giả")]),n("span",{staticClass:"info-field--value"},[t._v(t._s(t.creatorId))])])])]),n("div",{staticClass:"pending-post-metadata"},[t._m(0),n("hr",{staticClass:"is-hr mb-3"}),n("div",{staticClass:"px-3 pb-3 ha-vertical-layout-6 is-flex is-flex-direction-column"},[n("div",{staticClass:"info-field"},[n("span",{staticClass:"info-field--label"},[t._v("Tin nhắn")]),n("b-input",{staticClass:"info-field--value",attrs:{type:"textarea",value:t.customInfo.message,disabled:!0}})],1)])])])},a=[function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"mb-1"},[n("span",{staticClass:"has-text-weight-bold ml-3 is-size-5 has-text-grey"},[t._v("Thông tin khác")])])}],e=n("0514"),c={props:{verification:{type:Object,default:function(){return null}}},computed:{createdDateInStr:function(){var t;return new Date(null===(t=this.verification)||void 0===t?void 0:t.created_date).toLocaleString("en-US")},customInfo:function(){var t;return null!==(t=this.verification.custom_info)&&void 0!==t?t:{}},status:function(){return e["b"][this.verification.status]},isPending:function(){return 2===this.verification.status},creatorId:function(){return this.verification.author_id}}},o={name:"VerificationInfo",mixins:[c],data:function(){return{isButtonLoading:!1}},computed:{isMetadataChanged:function(){for(var t in this.customInfo)if(this.postCustomInfo[t]!==this.customInfo[t])return!0;return!1}}},r=o,u=(n("078c"),n("2877")),l=Object(u["a"])(r,s,a,!1,null,null,null);i["default"]=l.exports},"4a99":function(t,i,n){}}]);
//# sourceMappingURL=chunk-000c998f.70a0918d.js.map