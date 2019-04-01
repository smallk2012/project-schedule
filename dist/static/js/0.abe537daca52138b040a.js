webpackJsonp([0],{Xj2K:function(e,t){},wDQo:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("woOf"),l=a.n(r),s=window.XLSX,o={name:"Home",data:function(){return{developers:{},colors:["#7A24A6","#001E64","#0070C6","#00B2F6","#00B441","#7ED432","#FEFF00","#FFBE00","#FF0000","#D20000"],dateAr:[],tableData:[],xlsxData:[],xlsxFields:[],fileName:"",suffix:"xlsx",startTime:"",remarks:[],dever:"开发人员",devlogDays:[],finishDateAr:[]}},computed:{developersList:function(){var e=[];for(var t in this.developers)t!=this.dever&&e.push(t);return e},developersDays:function(){var e={time:0,delayTime:0};for(var t in this.developers)t!=this.dever&&(e.time+=parseInt(10*this.developers[t].time),e.delayTime+=parseInt(10*this.developers[t].delayTime));return e},devDays:function(){var e=1e7,t=0;for(var a in this.developers)a!=this.dever&&(e=Math.min(this.developers[a].time,e),t=Math.max(this.developers[a].time,t));return{max:t,min:1e7==e?0:e}}},methods:{colorRgb:function(e,t){var a=e.toLowerCase();if(a&&/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(a)){if(4===a.length){for(var r="#",l=1;l<4;l+=1)r+=a.slice(l,l+1).concat(a.slice(l,l+1));a=r}for(var s=[],o=1;o<7;o+=2)s.push(parseInt("0x"+a.slice(o,o+2)));a="rgba("+s.join(",")+","+(void 0!=t?t:.3)+")"}var i=a.replace(/rgba?\(/,"").replace(/\)/,"").replace(/[\s+]/g,"").split(","),n=parseFloat(i[3]||1),d=Math.floor(n*parseInt(i[0])+255*(1-n)),h=Math.floor(n*parseInt(i[1])+255*(1-n)),v=Math.floor(n*parseInt(i[2])+255*(1-n));return"#"+("0"+d.toString(16)).slice(-2)+("0"+h.toString(16)).slice(-2)+("0"+v.toString(16)).slice(-2)},getCellStyle:function(e){var t="";if(e.columnIndex>this.xlsxFields.length-1&&""!=e.row[this.dever]){var a=e.row.dateAr[e.columnIndex-this.xlsxFields.length];t=2==a?"background-color:"+e.row.color:3==a?"background-color:"+this.colorRgb(e.row.color):4==a?"background-color:"+this.colorRgb(e.row.color,.7):""}return t},getTotalTime:function(e,t,a){for(var r=0,l=0,s=[];r<Math.ceil(e);){var o=new Date(Date.parse(void 0!=a?a:this.startTime)+864e5*l);0!=o.getDay()&&6!=o.getDay()&&r++,l++;var i={date:o.format("MM月dd日"),weekend:0!=o.getDay()&&6!=o.getDay()?0:1};s.push(i)}for(;l<=t;){var n=new Date(Date.parse(void 0!=a?a:this.startTime)+864e5*l),d={date:n.format("MM月dd日"),weekend:0!=n.getDay()&&6!=n.getDay()?0:1};s.push(d),l++}return s},onchange:function(e){var t=this,a=e.target.files;if(a&&0!=a.length){var r=a[0];t.fileName=r.name.replace("."+t.suffix,"").split(" ")[0],t.startTime=t.fileName.split("_")[1].replace(/\-/g,"/"),console.log(t.startTime);var l=new FileReader;l.onload=function(e){for(var a="",r=new Uint8Array(e.target.result),l=r.byteLength,o=0;o<l;o++)a+=String.fromCharCode(r[o]);for(var i,n=s.read(a,{type:"binary"}),d=n.SheetNames[0],h=n.Sheets[d],v=s.utils.sheet_to_json(h,{header:1}),f=v.length,g=0;g<v.length;g++)if(""===v[g].join("").toString().trim()){f=g;break}i=v.splice(0,f);for(var c=[],p=0;p<v.length;p++){var m=v[p].join("").toString().trim();""!==m&&c.push(m)}if(t.remarks=c,t.xlsxData=i,i.length){for(var u=[],y=0;y<i[0].length;y++){if("进度"==i[0][y]){u.push(i[0][y]);break}u.push(i[0][y])}t.xlsxFields=u;for(var D=[],b=1;b<i.length;b++){for(var x={},A=0;A<u.length;A++)A<i[b].length?x[u[A]]=i[b][A]||"":x[u[A]]="";D.push(x)}t.developers={};for(var w=0;w<D.length;w++){var _=t.developers[D[w][t.dever]||t.dever]||{};_.time=_.time||0,_.delayTime=_.delayTime||0,D[w].min=parseInt(_.time),D[w].devlog=D[w].devlog||[];var C=D[w].开发记录.trim(),S=[];C&&""!=D[w][t.dever].trim()?(S=(S=C.split("#")).splice(1,S.length),D[w].devlog=D[w].devlog.concat(S),t.devlogDays=t.devlogDays.concat(S),D[w].延期天数=S.length>Math.ceil(parseFloat(D[w].评估天数||0))?S.length-parseFloat(D[w].评估天数||0):""):D[w].延期天数="",_.delayTime+=parseFloat(D[w].延期天数||0),_.time+=parseFloat(D[w].评估天数||0)+parseFloat(D[w].延期天数||0),D[w].max=Math.ceil(_.time),t.developers[D[w][t.dever]||t.dever]=_}var k=0,F=0;for(var M in t.developers)k=Math.max(t.developers[M].time,k),t.developers[M].color=t.colors[Math.floor(F%t.colors.length)],F++;var T=0;if(t.devlogDays.length){for(var L=0,O=0;O<t.devlogDays.length;O++)L=Math.max(Date.parse(t.devlogDays[O])||0,L);T=Math.abs(Date.parse(t.startTime)-L)/864e5}t.dateAr=t.getTotalTime(k,T);for(var R=0;R<D.length;R++){D[R].dateAr=[];var j=0;D[R].color=t.developers[D[R][t.dever]||t.dever].color;for(var N=0;N<t.dateAr.length;N++){j>=D[R].min&&j<D[R].max&&1!=t.dateAr[N].weekend?D[R].dateAr.push(2):1==t.dateAr[N].weekend?D[R].dateAr.push(1):D[R].dateAr.push(0),1!=t.dateAr[N].weekend&&j++;for(var B=0;B<D[R].devlog.length;B++)if(Date.parse(D[R].devlog[B])==Date.parse(t.startTime)+864e5*N){D[R].dateAr[D[R].dateAr.length-1]=2==D[R].dateAr[D[R].dateAr.length-1]?4:3;break}}}for(var I=0;I<D.length;I++){var E=t.developers[D[I][t.dever]||t.dever];if(E.剩余天数=E.剩余天数||0,100!=D[I].进度&&(D[I].延期天数||0)>0)E.剩余天数+=1;else{for(var U=0,X=0;X<D[I].devlog.length;X++){for(var K=0,$=0;$<t.devlogDays.length;$++)Date.parse(D[I].devlog[X])==Date.parse(t.devlogDays[$])&&K++;K>0&&(U+=Math.floor(1e3/K))}E.剩余天数+=100!=D[I].进度?(D[I].评估天数||0)-U/1e3:0}}var H=0;for(var J in t.developers)H=Math.max(t.developers[J].剩余天数,H);for(var P=(new Date).format("yyyy/MM/dd"),Q=1,V=0;V<t.devlogDays.length;V++)if(Date.parse(P)==Date.parse(t.devlogDays[V])){Q=0;break}var q=new Date(Date.parse(P)+864e5*Q).format("yyyy/MM/dd");t.finishDateAr=t.getTotalTime(Math.ceil(H),0,q),t.tableData=D}},l.readAsArrayBuffer(r)}},sheetStyle:function(e,t){var a={v:e=e.toString(),t:isNaN(Number(e))||""===e.trim()?-1!=e.indexOf("月")&&-1!=e.indexOf("日")&&e.length==e.indexOf("日")+1?"n":"s":"n"};return t&&(a.s={fill:{fgColor:{rgb:t.replace("#","")}}}),a},saveAs:function(e){var t=document.createElement("a");t.download=this.fileName+"."+this.suffix,"msSaveOrOpenBlob"in navigator?window.navigator.msSaveOrOpenBlob(e,t.download):t.href=URL.createObjectURL(e),t.click(),setTimeout(function(){URL.revokeObjectURL(e)},100)},downloadExl:function(){for(var e=[],t=this.xlsxFields.map(function(e){return{name:e,value:0}}).concat(this.dateAr.map(function(e){return{name:e.date,value:e.weekend}})),a={},r="A1",o=0;o<t.length;o++){var i=o>25?this.getCharCol(o):String.fromCharCode(65+o);a[i+1]=this.sheetStyle(t[o].name,1==t[o].value?"#CCCCCC":""),a[i+(this.tableData.length+2)]=this.sheetStyle("","#000000"),r=i+(this.tableData.length+2);for(var n=0;n<this.remarks.length;n++)a[i+(this.tableData.length+3+n)]=this.sheetStyle(0==o?this.remarks[n].trim():""),r=i+(this.tableData.length+3+n),0==o&&e.push({s:{c:0,r:this.tableData.length+3+n-1},e:{c:this.xlsxFields.length-1,r:this.tableData.length+3+n-1}})}for(var d=0;d<this.tableData.length;d++)for(var h=0;h<t.length;h++){var v=h>25?this.getCharCol(h):String.fromCharCode(65+h);if(h<this.xlsxFields.length)a[v+(d+2)]=this.sheetStyle(this.tableData[d][this.xlsxFields[h]]);else{var f=this.tableData[d].dateAr[h-this.xlsxFields.length],g="";g=""!=this.tableData[d][this.dever]&&2==f?this.tableData[d].color:1==f?"#CCCCCC":3==f?this.colorRgb(this.tableData[d].color):4==f?this.colorRgb(this.tableData[d].color,.7):"",a[v+(d+2)]=this.sheetStyle("",g)}}a["!merges"]=e;var c={SheetNames:["排期"],Sheets:{"排期":l()({},a,{"!ref":"A1:"+r})}};console.log(c);var p=new Blob([this.s2ab(s.write(c,{bookType:this.suffix,bookSST:!1,type:"binary"}))],{type:""});this.saveAs(p)},getCharCol:function(e){for(var t="",a=0;e>0;)a=e%26+1,t=String.fromCharCode(a+64)+t,e=(e-a)/26;return t},s2ab:function(e){if("undefined"!=typeof ArrayBuffer){for(var t=new ArrayBuffer(e.length),a=new Uint8Array(t),r=0;r!=e.length;++r)a[r]=255&e.charCodeAt(r);return t}for(var l=new Array(e.length),s=0;s!=e.length;++s)l[s]=255&e.charCodeAt(s);return l}},mounted:function(){}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page"},[a("div",{staticStyle:{"margin-bottom":"20px"}},[a("input",{attrs:{type:"file",multiple:"false",id:"sheetjs-input",accept:".xlsx,.xls"},on:{change:function(t){e.onchange(t)}}}),e._v(" "),e.tableData.length?a("button",{attrs:{type:"button"},on:{click:e.downloadExl}},[e._v("导出XLSX")]):e._e()]),e._v(" "),a("p",[e._v("项目："+e._s(e.fileName.split("_")[0])+"     工作日："+e._s(e.developersDays.time/10)+"天/人\n        "),e.developersDays.delayTime>0?a("span",[e._v("(包括延期"+e._s(e.developersDays.delayTime/10)+"天)")]):e._e(),e._v("     开发(包括周末)："+e._s(e.dateAr.length)+"天/"+e._s(e.developersList.length)+"人")]),e._v(" "),a("p",[e._v("开始日期："+e._s(e.dateAr.length?e.dateAr[0].date:"")+"     结束日期："+e._s(e.dateAr.length?e.dateAr[e.dateAr.length-1].date:"")),e.finishDateAr.length?a("span",[e._v("     当前进度结束日期："+e._s(e.finishDateAr[e.finishDateAr.length-1].date))]):e._e()]),e._v(" "),a("p",{staticStyle:{"margin-bottom":"20px"}},[e._v("开发人员："+e._s(e.developersList.toString())+"     单人最短："+e._s(e.devDays.min)+"天     单人最长："+e._s(e.devDays.max)+"天")]),e._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,border:"",height:"480","cell-style":e.getCellStyle}},[e._l(e.xlsxFields,function(e,t){return a("el-table-column",{key:e+t,attrs:{"show-overflow-tooltip":"",fixed:"","header-align":"center",prop:e,label:e}})}),e._v(" "),e._l(e.dateAr,function(e,t){return a("el-table-column",{key:t,attrs:{"show-overflow-tooltip":"","min-width":"120",align:"center","class-name":e.weekend?"gray":"",label:e.date,width:"100"}})})],2),e._v(" "),e._l(e.remarks,function(t,r){return a("p",{key:r},[e._v(e._s(t))])})],2)},staticRenderFns:[]};var n=a("VU/8")(o,i,!1,function(e){a("Xj2K")},"data-v-62fbfadc",null);t.default=n.exports}});