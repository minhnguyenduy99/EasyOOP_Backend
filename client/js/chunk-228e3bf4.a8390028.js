(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-228e3bf4"],{1380:function(t,e,n){"use strict";n("b833")},ad51:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"user-view-header-content"}},[n("transition",{attrs:{name:"custom-transition",mode:"in-out","enter-active-class":"animate__animated animate__slideInDown","leave-active-class":"animate__animated animate__slideOutUp"}},[n("b-navbar",{directives:[{name:"show",rawName:"v-show",value:t._showNavbar,expression:"_showNavbar"}],staticClass:"navigation-bar",attrs:{"fixed-top":"",type:"is-primary-dark",shadow:!1},scopedSlots:t._u([{key:"brand",fn:function(){return[n("b-navbar-item",{staticClass:"px-3",attrs:{tag:"router-link",to:"/"}},[n("img",{attrs:{id:"website-icon",src:"https://res.cloudinary.com/dml8e1w0z/image/upload/v1624886684/oop-learning-helper/logo_lkpsia.png",width:"36",height:"36"}})])]},proxy:!0},{key:"start",fn:function(){return[n("b-navbar-dropdown",{ref:"post-dropdown",staticClass:"is-navbar-fullwidth",attrs:{hoverable:"",collapsible:"",boxed:""},scopedSlots:t._u([{key:"label",fn:function(){return[n("p",{staticClass:"has-text-weight-bold"},[t._v("CHỦ ĐỀ")])]},proxy:!0}])},[n("posts-by-topic-panel",{on:{"item-clicked":t.$onItemClicked}})],1),n("b-navbar-dropdown",{ref:"test-dropdown",staticClass:"is-navbar-fullwidth",attrs:{hoverable:"",collapsible:"",boxed:""},scopedSlots:t._u([{key:"label",fn:function(){return[n("p",{staticClass:"has-text-weight-bold"},[t._v("BÀI TEST")])]},proxy:!0}])},[n("tests-by-topic-panel",{on:{"item-clicked":t.$onItemClicked}})],1),n("b-navbar-item",{attrs:{tag:"div"}},[n("b-button",{attrs:{rounded:"",type:"is-primary","icon-right":"search"},on:{click:function(e){t.showSearchModal=!0}}})],1)]},proxy:!0},{key:"end",fn:function(){return[n("b-navbar-item",{attrs:{tag:"div"}},[n("div",{staticClass:"is-flex"},[t.isAuthenticated?n("user-badge",{attrs:{user:t.user}}):n("b-button",{staticClass:"has-text-weight-bold",attrs:{type:"is-primary"},on:{click:t.$p_showLoginModal}},[t._v("ĐĂNG NHẬP")])],1)])]},proxy:!0}])})],1),n("b-modal",{staticClass:"search-modal is-content-stickable",attrs:{"full-screen":""},model:{value:t.showSearchModal,callback:function(e){t.showSearchModal=e},expression:"showSearchModal"}},[n("search-modal")],1)],1)},a=[],s=n("5530"),i=(n("d3b7"),n("3ca3"),n("ddb0"),n("2f62")),r=n("4360"),c={name:"UserViewHeader",components:{"user-badge":function(){return n.e("chunk-7644b16b").then(n.bind(null,"47d2"))},"search-modal":function(){return Promise.all([n.e("chunk-785f9ee4"),n.e("chunk-442e2232")]).then(n.bind(null,"4b9e"))},"posts-by-topic-panel":function(){return Promise.all([n.e("chunk-2a303700"),n.e("chunk-932ac754"),n.e("chunk-210ea2fa"),n.e("chunk-072e95f0"),n.e("chunk-016e5678")]).then(n.bind(null,"d791"))},"tests-by-topic-panel":function(){return Promise.all([n.e("chunk-2a303700"),n.e("chunk-932ac754"),n.e("chunk-210ea2fa"),n.e("chunk-072e95f0"),n.e("chunk-c18dc926")]).then(n.bind(null,"9965"))}},inject:["$p_showLoginModal","headerTransition"],provide:function(){return{$toggleSearchModal:this.$_toggleSearchModal.bind(this),$toggleDropdown:this.$_toggleDropdown.bind(this)}},data:function(){return{isScrollTop:!0,showNavbar:!0,scrollPosition:0,isLoading:!1,listTopics:[],showSearchModal:!1,dropdownActives:[!1,!1]}},computed:Object(s["a"])(Object(s["a"])({},Object(i["c"])("AUTH",["isAuthenticated","user"])),{},{_showNavbar:{get:function(){return!this.hasTransition||this.showNavbar},set:function(t){this.showNavbar=t}},hasTransition:function(){return this.headerTransition.value}}),mounted:function(){this.$_injectScrollBehaviour(),document.body.classList.add("has-navbar-fixed-top")},methods:Object(s["a"])(Object(s["a"])({},Object(i["b"])(r["a"].AUTH,{$store_login:"login"})),{},{$_toggleSearchModal:function(t){this.showSearchModal=t},$onItemClicked:function(){this.$refs["post-dropdown"].newActive=this.$refs["test-dropdown"].newActive=!1},$_toggleDropdown:function(){var t=[this.$refs.dropdown0,this.$refs.dropdown1],e=t[0],n=t[1];0===this.currentDropdownIndex&&e.toggle(),1===this.currentDropdownIndex&&n.toggle()},$_injectScrollBehaviour:function(){window.addEventListener("scroll",function(){var t=window.scrollY;t>this.scrollPosition?this.showNavbar=!1:(this.showNavbar=!0,this.isScrollTop=t<=70),this.scrollPosition=t}.bind(this))}})},l=c,d=(n("1380"),n("2877")),h=Object(d["a"])(l,o,a,!1,null,"e72b34e6",null);e["default"]=h.exports},b833:function(t,e,n){}}]);
//# sourceMappingURL=chunk-228e3bf4.a8390028.js.map