(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-43be168f"],{"1b8f":function(t,e,a){"use strict";a("3ae3")},"3ae3":function(t,e,a){},fa40:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:[t.editable?"test-template-editable":"test-template"]},[t.editable?a("div",[a("div",{staticClass:"ha-vertical-layout-7"},[t._t("add",[a("b-button",{attrs:{type:"is-primary","icon-right":"plus",inverted:""},on:{click:t.$addNewData}},[t._v(t._s(t.addButtonText))])],null,{add:t.$addNewData}),a("b-field",{attrs:{label:t.headerTitleLabel,"label-position":"inside"}},[a("b-input",{model:{value:t.currentTemplate.title,callback:function(e){t.$set(t.currentTemplate,"title",e)},expression:"currentTemplate.title"}})],1),a("div",{staticClass:"test-template-data-container"},t._l(t.currentTemplate.template_data,(function(e,i){return a("div",{key:e.id,staticClass:"is-flex is-align-items-center"},[a("b-dropdown",{scopedSlots:t._u([{key:"trigger",fn:function(){return[a("b-button",{attrs:{type:"is-primary-light"},on:{click:function(e){t.toggles[i]=!0}}},[t._v(" "+t._s(e.data_title||"Tên bài test")+" ")])]},proxy:!0}],null,!0),model:{value:t.toggles[i],callback:function(e){t.$set(t.toggles,i,e)},expression:"toggles[index]"}},[a("b-dropdown-item",{attrs:{custom:"",paddingless:""}},[a("div",{staticClass:"test-template-edit ha-vertical-layout-7 p-3"},[a("b-field",{attrs:{type:"is-primary",label:t.testTitleLabel,"label-position":"inside"}},[a("b-input",{model:{value:e.data_title,callback:function(a){t.$set(e,"data_title",a)},expression:"data.data_title"}})],1),a("div",{staticClass:"block px-2"},[a("p",{staticClass:"has-text-grey"},[t._v(t._s(t.testLinkLabel))]),a("p",{staticClass:"is-size-6"},[a("a",{attrs:{href:e.data_link}},[t._v(t._s(e.data_link))])])])],1)])],1),a("b-button",{staticClass:"is-icon-button ml-1",attrs:{size:"is-small",inverted:"",type:"is-danger","icon-right":"trash"},on:{click:function(e){return t.$deleteData(i)}}})],1)})),0)],2)]):a("div",[a("h1",{staticClass:"mb-3 is-size-5 has-text-grey"},[t._v(" "+t._s(t.currentTemplate.title)+" ")]),a("div",{staticClass:"test-template-data-container"},t._l(t.currentTemplate.template_data,(function(e){return a("b-button",{key:e.id,class:t.template.class,attrs:{tag:"a",type:"is-primary-light",href:e.data_link}},[t._v(" "+t._s(e.data_title)+" ")])})),1)])])},l=[],s=(a("a434"),a("5530")),n=function(t){return{props:{template:{title:String,tag:String,class:String,template_data:Array}},methods:{$buildTemplate:function(){return Object(s["a"])({type:t},this.template)}}}},r={name:"TestTemplate",mixins:[n("test")],props:{editable:{type:Boolean,default:function(){return!0}},headerTitleLabel:String,testTitleLabel:String,testLinkLabel:String,saveButtonText:String,addButtonText:String},data:function(){return{currentTemplate:{title:"",class:"",template_data:[]},toggles:[]}},mounted:function(){this.template?this.currentTemplate=this.template:this.$emit("update:template",this.currentTemplate)},watch:{currentTemplate:function(t){this.$emit("update:template",t)}},methods:{$addNewData:function(t){this.currentTemplate.template_data.push(t),this.$set(this.toggles,this.toggles.length,!1)},$deleteData:function(t){var e=this.currentTemplate.template_data[t];this.currentTemplate.template_data.splice(t,1),this.$emit("deleted",e,t)},$toggleDropdown:function(t){t.config.showEditDropdown=!t.config.showEditDropdown}}},d=r,o=(a("1b8f"),a("2877")),c=Object(o["a"])(d,i,l,!1,null,"eecf6eb8",null);e["default"]=c.exports}}]);
//# sourceMappingURL=chunk-43be168f.723da293.js.map