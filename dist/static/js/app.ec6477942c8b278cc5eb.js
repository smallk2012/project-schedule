webpackJsonp([4],{0:function(e,t,n){n("j1ja"),e.exports=n("NHnr")},"6ZUI":function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("7+uW"),o=n("woOf"),i=n.n(o),a=n("//Fk"),u=n.n(a),l=n("mvHQ"),s=n.n(l),c=n("mtWM"),f=n.n(c),p={debug:!0,mock:!0,baseURL:"/api",callBack:function(e){var t=e.data.code?e.data:{};return t&&t.code?"50015"!=t.code&&"10003"!=t.code||(window.location.href="#/login"):(t.code=-1e4,t.msg="服务异常"+e.status),t}},d=n("mw3O"),g=n.n(d),m=this,h=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];$.debug&&console.log.apply(m,t)},v=n("Dd8w"),x=n.n(v),S={get:function(e){var t=sessionStorage[e];if(!t||"null"===t)return null;var n,r=S.getCurrentTimeStamp();try{n=JSON.parse(t)}catch(e){return null}return 0===n.expiryTime||n.expiryTime>r?n.value:null},set:function(e,t,n){var r={value:t,expiryTime:!n||isNaN(n)?0:S.getCurrentTimeStamp()+parseInt(n)};sessionStorage[e]=s()(r)},del:function(e){sessionStorage.removeItem(e)},getCurrentTimeStamp:function(){return Date.parse(new Date)}},T=S;function y(e,t,n,r){r=r||{};var o=(t=t||"").substring(t.lastIndexOf("/")+1,t.length),i=t.substring(0,t.lastIndexOf("/"));-1!=i.lastIndexOf("/")&&(o=i.substring(i.lastIndexOf("/")+1,i.length)+o);var a=o;if(E(a,r))return!1;O[a]=r;var u=I.mock?"./static/mock"+t+".json":t,l=I.mock?"":I.baseURL;f()({method:I.mock?"GET":"POSTJSON"==e?"POST":e,url:u,data:"POST"===e||"PUT"===e?g.a.stringify(r):null,params:"POSTJSON"===e||"GET"===e||"DELETE"===e?r:null,baseURL:l,withCredentials:!1,headers:{"Content-Type":"POST"===e||"PUT"===e?"application/x-www-form-urlencoded":"application/json"}}).then(function(t){w(a,r),h("请求方法："+e),h("请求链接："+l+u),h("请求参数："+s()(r)),h(s()(t.data)),n&&n(I.callBack(t))})}f.a.interceptors.request.use(function(e){var t=T.get("token");return t&&(t="string"==typeof t?{token:t}:t,e.headers=x()({},e.headers,t)),e},function(e){return u.a.reject(e)}),f.a.interceptors.response.use(function(e){return e},function(e){return u.a.resolve(e.response||{data:{}})});var O={},E=function(e,t){var n=!1;for(var r in O)if(r==e&&O[r]&&s()(O[r])==s()(t)){n=!0;break}return n},w=function(e,t){O[e]&&s()(O[e])==s()(t)&&delete O[e]},I={get:function(e,t,n){return y("GET",e,t,n)},post:function(e,t,n){return y("POST",e,t,n)},postJson:function(e,t,n){return y("POSTJSON",e,t,n)},promiseGet:function(e,t){return new u.a(function(n,r){y("GET",e,function(e){n(e)},t)})},promisePost:function(e,t){return new u.a(function(n,r){y("POST",e,function(e){n(e)},t)})}};i()(I,p),i()(I,{url:{login:"/wxcode/login"}});var $=I,N={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var b=n("VU/8")({name:"App"},N,!1,function(e){n("6ZUI")},null,null).exports,R=n("/ocq"),k={routes:[{path:"/hello",name:"HelloWorld",component:function(){return n.e(1).then(n.bind(null,"gORT"))}},{path:"/login",name:"Login",component:function(){return n.e(2).then(n.bind(null,"r99a"))}},{path:"/home",name:"Home",component:function(){return n.e(0).then(n.bind(null,"wDQo"))}},{path:"*",redirect:{path:"/home"}}]};r.default.use(R.a);var F=new R.a(k);F.beforeEach(function(e,t,n){n()});var M=F,D={get:function(e){var t=localStorage[e];if(!t||"null"===t)return null;var n,r=D.getCurrentTimeStamp();try{n=JSON.parse(t)}catch(e){return null}return 0===n.expiryTime||n.expiryTime>r?n.value:null},set:function(e,t,n){var r={value:t,expiryTime:!n||isNaN(n)?0:D.getCurrentTimeStamp()+parseInt(n)};localStorage[e]=s()(r)},del:function(e){localStorage.removeItem(e)},getCurrentTimeStamp:function(){return Date.parse(new Date)}},P=D,B=n("fZjL"),U={kNumFmt:function(e){if(void 0===e||null===e||isNaN(e)||""===e)return e;var t=parseInt(e);t=t.toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,");var n="",r=e.toString().split(".");return 2==r.length&&(n="."+r[1]),t+n},nullFmt:function(e,t,n){return n=n||"--",t=t||"",void 0===e||null===e||""===e?n:e+t},numFloadtCount:function(e,t,n){return t=void 0==t?2:t,void 0===e||null===e||isNaN(e)||""===e?e:n&&0==e?e:e.toFixed(t)},numFmt:function(e,t){var n=e=e||0,r="";return e>=1e8?(r="亿",n=e/1e8):e>=1e4?(r="万",n=e/1e4):n=e,void 0==t?r:n.toFixed(t)},bytesToSize:function(e,t){if(0===(e=parseInt(e)))return"0 B";var n=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(e)/Math.log(1024)),o=e/Math.pow(1024,r);switch(r){case 0:case 1:o=(void 0==t?o.toFixed(0):o.toFixed(t))+n[r];break;default:o=(void 0==t?o.toFixed(2):o.toFixed(t))+n[r]}return o}};n.n(B)()(U).forEach(function(e){r.default.filter(e,U[e])});var L=U;n("tNmO");r.default.directive("highlightFmt",function(e,t){for(var n=e.innerText,r=t.value,o=(r=r.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")).split(" "),i=0;i<o.length;i++)if(o[i]){var a=new RegExp(o[i],"g");n=n.replace(a,"<i>"+o[i].replace(/\\([.?*+^$[\]\\(){}|-])/g,"$1")+"</i>")}e.innerHTML=n});var C,W=n("NYxO"),j=n("bOdI"),G=n.n(j),H={namespaced:!0,state:{keyWord:"demo",islogined:!1,loginInfo:{name:"cC"}},actions:{setKeyWord:function(e,t){(0,e.commit)("KEYWORD",t)},setLoading:function(e,t){var n=e.dispatch;(0,e.commit)("ISLOGINED",t),n("setUserInfo",{name:"kK"})},setUserInfo:function(e,t){(0,e.commit)("USERINFO",t)}},getters:{keyWord:function(e){return e.keyWord},islogined:function(e){return e.islogined},loginInfo:function(e){return e.loginInfo}},mutations:(C={},G()(C,"KEYWORD",function(e,t){e.keyWord=t}),G()(C,"ISLOGINED",function(e,t){e.islogined=t}),G()(C,"USERINFO",function(e,t){e.loginInfo=t}),C)};r.default.use(W.a);var J=new W.a.Store({modules:{app:H}}),K=n("zL8q"),Y=n.n(K);n("tvR6");r.default.use(Y.a),r.default.prototype.$api=$,r.default.prototype.$local=P,r.default.prototype.$session=T,r.default.prototype.$filter=L,r.default.prototype.$log=h,r.default.config.productionTip=!1,new r.default({el:"#app",store:J,router:M,render:function(e){return e(b)}}).$mount("#app")},tNmO:function(e,t){Number.prototype.toFixed=function(e){var t=this+"";if(e||(e=0),-1==t.indexOf(".")&&(t+="."),t+=new Array(e+1).join("0"),new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(e+1)+"})?)\\d*$").test(t)){var n="0"+RegExp.$2,r=RegExp.$1,o=RegExp.$3.length,i=!0;if(o==e+2){if(o=n.match(/\d/g),parseInt(o[o.length-1])>4)for(var a=o.length-2;a>=0&&(o[a]=parseInt(o[a])+1,10==o[a]);a--)o[a]=0,i=1!=a;n=o.join("").replace(new RegExp("(\\d+)(\\d{"+e+"})\\d$"),"$1.$2")}return i&&(n=n.substr(1)),(r+n).replace(/\.$/,"")}return this+""},Date.prototype.format=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"yyyy-MM-dd",t={"M+":this.getMonth()+1,"d+":this.getDate(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var n in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),t)new RegExp("("+n+")").test(e)&&(e=e.replace(RegExp.$1,1===RegExp.$1.length?t[n]:("00"+t[n]).substr((""+t[n]).length)));return e}},tvR6:function(e,t){}},[0]);