(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c0e96"],{4499:function(e,n,t){"use strict";t.r(n);var o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("b-button",e._g(e._b({attrs:{type:"is-facebook","icon-pack":"fab","icon-left":"facebook-f",tag:"a"},on:{click:e.$on_clicked}},"b-button",e.$attrs,!1),e.$listeners),[e._v(" FACEBOOK ")])},c=[],i=t("5530"),a=t("2f62"),r=t("ed08"),s=(t("d3b7"),r["a"].VUE_APP_FACEBOOK_APP_ID);function b(){return new Promise((function(e){window.fbAsyncInit=function(){FB.init({appId:s,cookie:!0,xfbml:!0,version:"v10.0"}),FB.AppEvents.logPageView()},function(e,n,t){var o,c=e.getElementsByTagName(n)[0];e.getElementById(t)||(o=e.createElement(n),o.id=t,o.src="https://connect.facebook.net/en_US/sdk.js",c.parentNode.insertBefore(o,c))}(document,"script","facebook-jssdk")}))}var l={name:"FacebookLoginButton",inheritAttrs:!1,methods:Object(i["a"])(Object(i["a"])({},Object(a["b"])("AUTH",["loginWithFacebookToken"])),{},{$on_clicked:function(){var e=this;this.loginWithFacebookToken().then((function(n){var t=n.error;t?e.$emit("logined",{error:t}):e.$emit("logined",{})}))}}),mounted:function(){b()}},u=l,f=t("2877"),d=Object(f["a"])(u,o,c,!1,null,null,null);n["default"]=d.exports}}]);
//# sourceMappingURL=chunk-2d0c0e96.61c549ac.js.map