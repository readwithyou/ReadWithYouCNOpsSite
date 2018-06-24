module.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=22)}([function(e,t){e.exports=require("express")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("aws-sdk")},function(e,t,n){var r=n(6),s=n(5);e.exports=function(e,t,n){var o=e.headers["x-access-token"];if(!o)return t.status(403).send({auth:!1,message:"No token provided."});r.verify(o,s.secret,function(r,s){if(r)return t.status(500).send({auth:!1,message:"Failed to authenticate token."});e.username=s.id,n()})}},function(e,t){e.exports=function(){var e=new Date,t=e.getFullYear().toString().substring(2,4);return t=e.getMonth()<10?t+"0"+(e.getMonth()+1):t+(e.getMonth()+1),t=e.getDate()<10?t+"0"+e.getDate():t+e.getDate(),t=e.getHours()<10?t+"0"+e.getHours():t+e.getHours(),t=e.getMinutes()<10?t+"0"+e.getMinutes():t+e.getMinutes(),t=e.getSeconds()<10?t+"0"+e.getSeconds():t+e.getSeconds()}},function(e,t){e.exports={secret:"da3057da-82df-4fbf-8dc2-69b41b901570"}},function(e,t){e.exports=require("jsonwebtoken")},function(e,t){e.exports=require("path")},function(e,t,n){var r=n(2),s=function(){r.config.region="cn-north-1";var e=new r.DynamoDB.DocumentClient;return{get:function(t,n){var r={TableName:"Teacher",Key:{ID:t}};e.get(r,n)},create:function(t,n){var r={TableName:"Teacher",Item:t,ConditionExpression:"attribute_not_exists(ID)"};e.put(r,n)},scan:function(t){var n={TableName:"Teacher"};e.scan(n,t)},remove:function(t,n){var r={TableName:"Teacher",Key:{ID:t}};e.delete(r,n)}}}();e.exports=s},function(e,t,n){var r=n(0).Router(),s=n(1),o=n(3),i=n(4);r.use(s.urlencoded({extended:!1})),r.use(s.json());var a=n(8);r.get("/:id",o,function(e,t,n){a.get(e.params.id,function(e,n){if(e){console.log("DDB Error: "+e);t.status(500).end()}else t.json(n.Item)})}),r.get("/",o,function(e,t,n){a.scan(function(e,n){if(e){t.status(500).end()}else t.json(n.Items)})}),r.post("/",o,function(e,t,n){var r=e.body;r.ID=i(),r.createTime=(new Date).toISOString(),a.create(r,function(e,n){var r=200;if(e){console.log("DDB Error: "+e);r=500}t.status(r).end()})}),r.delete("/:id",o,function(e,t,n){a.remove(e.params.id,function(e,n){var r=200;if(e){console.log("DDB Error: "+e);r=500}t.status(r).end()})}),e.exports=r},function(e,t,n){var r=n(2),s="Students_Registration",o=function(){r.config.region="cn-north-1";var e=new r.DynamoDB.DocumentClient;return{get:function(t,n){var r={TableName:s,Key:{ID:t}};e.get(r,n)},create:function(t,n){var r={TableName:s,Item:t,ConditionExpression:"attribute_not_exists(ID)"};e.put(r,n)},scan:function(t){var n={TableName:s};e.scan(n,t)},remove:function(t,n){var r={TableName:s,Key:{ID:t}};e.delete(r,n)}}}();e.exports=o},function(e,t,n){var r=n(0).Router(),s=n(1),o=n(3),i=n(4);r.use(s.urlencoded({extended:!1})),r.use(s.json());var a=n(10);r.get("/:id",o,function(e,t,n){a.get(e.params.id,function(e,n){if(e){console.log("DDB Error: "+e);t.status(500).end()}else t.json(n.Item)})}),r.get("/",o,function(e,t,n){a.scan(function(e,n){if(e){t.status(500).end()}else t.json(n.Items)})}),r.post("/",o,function(e,t,n){var r=e.body;r.ID=i(),r.createTime=(new Date).toISOString(),a.create(r,function(e,n){var r=200;if(e){console.log("DDB Error: "+e);r=500}t.status(r).end()})}),r.delete("/:id",o,function(e,t,n){a.remove(e.params.id,function(e,n){var r=200;if(e){console.log("DDB Error: "+e);r=500}t.status(r).end()})}),e.exports=r},function(e,t){e.exports=require("bcryptjs")},function(e,t,n){var r=n(2),s=function(){r.config.region="cn-north-1";var e=new r.DynamoDB.DocumentClient;return{create:function(t,n){var r={TableName:"User",Item:t,ConditionExpression:"attribute_not_exists(username)"};e.put(r,n)},get:function(t,n){var r={TableName:"User",Key:{username:t}};e.get(r,n)}}}();e.exports=s},function(e,t,n){var r=n(0).Router(),s=n(1),o=n(3);r.use(s.urlencoded({extended:!1})),r.use(s.json());var i=n(13),a=n(6),c=n(12),u=n(5);r.post("/login",function(e,t){i.get(e.body.username,function(n,r){if(n)return console.log("DDB Error: "+n),t.status(500).send("Error on the server.");if(!r.Item)return t.status(404).send("No user found.");if(!c.compareSync(e.body.password,r.Item.password))return t.status(401).send({auth:!1,token:null});var s=a.sign({id:r.Item.username},u.secret,{expiresIn:86400});t.status(200).send({auth:!0,token:s})})}),r.get("/logout",function(e,t){t.status(200).send({auth:!1,token:null})}),r.post("/register",function(e,t){var n=c.hashSync(e.body.password,8);i.create({username:e.body.username,password:n},function(e,n){if(e)return console.log("DDB Error: "+e),t.status(500).send("There was a problem registering the user`.");var r=a.sign({id:n.username},u.secret,{expiresIn:86400});t.status(200).send({auth:!0,token:r})})}),r.get("/me",o,function(e,t,n){i.get(e.username,function(e,n){return e?t.status(500).send("There was a problem finding the user."):n?void t.status(200).send(n):t.status(404).send("No user found.")})}),e.exports=r},function(e,t,n){var r=n(0).Router();r.get("/",function(e,t){t.status(200).send("API works.")}),e.exports=r},function(e,t,n){var r=n(0).Router();r.get("/",function(e,t,n){t.render("index")}),e.exports=r},function(e){e.exports={_from:"ejs@^2.5.2",_id:"ejs@2.6.1",_inBundle:!1,_integrity:"sha512-0xy4A/twfrRCnkhfk8ErDi5DqdAsAqeGxht4xkCUrsvhhbQNs7E+4jV0CN7+NKIY0aHE72+XvqtBIXzD31ZbXQ==",_location:"/ejs",_phantomChildren:{},_requested:{type:"range",registry:!0,raw:"ejs@^2.5.2",name:"ejs",escapedName:"ejs",rawSpec:"^2.5.2",saveSpec:null,fetchSpec:"^2.5.2"},_requiredBy:["/nodeunit"],_resolved:"https://registry.npmjs.org/ejs/-/ejs-2.6.1.tgz",_shasum:"498ec0d495655abc6f23cd61868d926464071aa0",_spec:"ejs@^2.5.2",_where:"/Users/yonglinx/node_modules/nodeunit",author:{name:"Matthew Eernisse",email:"mde@fleegix.org",url:"http://fleegix.org"},bugs:{url:"https://github.com/mde/ejs/issues"},bundleDependencies:!1,contributors:[{name:"Timothy Gu",email:"timothygu99@gmail.com",url:"https://timothygu.github.io"}],dependencies:{},deprecated:!1,description:"Embedded JavaScript templates",devDependencies:{browserify:"^13.1.1",eslint:"^4.14.0","git-directory-deploy":"^1.5.1",istanbul:"~0.4.3",jake:"^8.0.16",jsdoc:"^3.4.0","lru-cache":"^4.0.1",mocha:"^5.0.5","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},homepage:"https://github.com/mde/ejs",keywords:["template","engine","ejs"],license:"Apache-2.0",main:"./lib/ejs.js",name:"ejs",repository:{type:"git",url:"git://github.com/mde/ejs.git"},scripts:{coverage:"istanbul cover node_modules/mocha/bin/_mocha",devdoc:"jake doc[dev]",doc:"jake doc",lint:'eslint "**/*.js" Jakefile',test:"jake test"},version:"2.6.1"}},function(e,t,n){"use strict";var r=/[|\\{}()[\]^$+*?.]/g;t.escapeRegExpChars=function(e){return e?String(e).replace(r,"\\$&"):""};var s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},o=/[&<>'"]/g;function i(e){return s[e]||e}t.escapeXML=function(e){return void 0==e?"":String(e).replace(o,i)},t.escapeXML.toString=function(){return Function.prototype.toString.call(this)+';\nvar _ENCODE_HTML_RULES = {\n      "&": "&amp;"\n    , "<": "&lt;"\n    , ">": "&gt;"\n    , \'"\': "&#34;"\n    , "\'": "&#39;"\n    }\n  , _MATCH_HTML = /[&<>\'"]/g;\nfunction encode_char(c) {\n  return _ENCODE_HTML_RULES[c] || c;\n};\n'},t.shallowCopy=function(e,t){for(var n in t=t||{})e[n]=t[n];return e},t.shallowCopyFromList=function(e,t,n){for(var r=0;r<n.length;r++){var s=n[r];void 0!==t[s]&&(e[s]=t[s])}return e},t.cache={_data:{},set:function(e,t){this._data[e]=t},get:function(e){return this._data[e]},reset:function(){this._data={}}}},function(e,t){e.exports=require("fs")},function(e,t,n){"use strict";
/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */var r=n(19),s=n(7),o=n(18),i=!1,a=n(17).version,c="%",u="locals",l=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],p=l.concat("cache"),d=/^\uFEFF/;function f(e,n){var s,o,i=n.views;if("/"==e.charAt(0))s=t.resolveInclude(e.replace(/^\/*/,""),n.root||"/",!0);else if(n.filename&&(o=t.resolveInclude(e,n.filename),r.existsSync(o)&&(s=o)),s||Array.isArray(i)&&i.some(function(n){return o=t.resolveInclude(e,n,!0),r.existsSync(o)})&&(s=o),!s)throw new Error('Could not find the include file "'+n.escapeFunction(e)+'"');return s}function m(e,n){var r,s=e.filename,o=arguments.length>1;if(e.cache){if(!s)throw new Error("cache option requires a filename");if(r=t.cache.get(s))return r;o||(n=h(s).toString().replace(d,""))}else if(!o){if(!s)throw new Error("Internal EJS error: no file name or template provided");n=h(s).toString().replace(d,"")}return r=t.compile(n,e),e.cache&&t.cache.set(s,r),r}function h(e){return t.fileLoader(e)}function g(e,t,n,r,s){var o=t.split("\n"),i=Math.max(r-3,0),a=Math.min(o.length,r+3),c=s(n),u=o.slice(i,a).map(function(e,t){var n=t+i+1;return(n==r?" >> ":"    ")+n+"| "+e}).join("\n");throw e.path=c,e.message=(c||"ejs")+":"+r+"\n"+u+"\n\n"+e.message,e}function v(e){return e.replace(/;(\s*$)/,"$1")}function _(e,n){n=n||{};var r={};this.templateText=e,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",this.dependencies=[],r.client=n.client||!1,r.escapeFunction=n.escape||o.escapeXML,r.compileDebug=!1!==n.compileDebug,r.debug=!!n.debug,r.filename=n.filename,r.delimiter=n.delimiter||t.delimiter||c,r.strict=n.strict||!1,r.context=n.context,r.cache=n.cache||!1,r.rmWhitespace=n.rmWhitespace,r.root=n.root,r.outputFunctionName=n.outputFunctionName,r.localsName=n.localsName||t.localsName||u,r.views=n.views,r.async=n.async,r.strict?r._with=!1:r._with=void 0===n._with||n._with,this.opts=r,this.regex=this.createRegex()}t.cache=o.cache,t.fileLoader=r.readFileSync,t.localsName=u,t.promiseImpl=new Function("return this;")().Promise,t.resolveInclude=function(e,t,n){var r=s.dirname,o=s.extname,i=(0,s.resolve)(n?t:r(t),e);return o(e)||(i+=".ejs"),i},t.compile=function(e,t){return t&&t.scope&&(i||(console.warn("`scope` option is deprecated and will be removed in EJS 3"),i=!0),t.context||(t.context=t.scope),delete t.scope),new _(e,t).compile()},t.render=function(e,t,n){var r=t||{},s=n||{};return 2==arguments.length&&o.shallowCopyFromList(s,r,l),m(s,e)(r)},t.renderFile=function(){var e,n,r,s=Array.prototype.slice.call(arguments),i=s.shift(),a={filename:i};return"function"==typeof arguments[arguments.length-1]&&(e=s.pop()),s.length?(n=s.shift(),s.length?o.shallowCopy(a,s.pop()):(n.settings&&(n.settings.views&&(a.views=n.settings.views),n.settings["view cache"]&&(a.cache=!0),(r=n.settings["view options"])&&o.shallowCopy(a,r)),o.shallowCopyFromList(a,n,p)),a.filename=i):n={},function(e,n,r){var s;if(!r){if("function"==typeof t.promiseImpl)return new t.promiseImpl(function(t,r){try{t(s=m(e)(n))}catch(e){r(e)}});throw new Error("Please provide a callback function")}try{s=m(e)(n)}catch(e){return r(e)}r(null,s)}(a,n,e)},t.clearCache=function(){t.cache.reset()},_.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"},_.prototype={createRegex:function(){var e="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",t=o.escapeRegExpChars(this.opts.delimiter);return e=e.replace(/%/g,t),new RegExp(e)},compile:function(){var e,t,n,r=this.opts,s="",i="",a=r.escapeFunction;this.source||(this.generateSource(),s+="  var __output = [], __append = __output.push.bind(__output);\n",r.outputFunctionName&&(s+="  var "+r.outputFunctionName+" = __append;\n"),!1!==r._with&&(s+="  with ("+r.localsName+" || {}) {\n",i+="  }\n"),i+='  return __output.join("");\n',this.source=s+this.source+i),e=r.compileDebug?"var __line = 1\n  , __lines = "+JSON.stringify(this.templateText)+"\n  , __filename = "+(r.filename?JSON.stringify(r.filename):"undefined")+";\ntry {\n"+this.source+"} catch (e) {\n  rethrow(e, __lines, __filename, __line, escapeFn);\n}\n":this.source,r.client&&(e="escapeFn = escapeFn || "+a.toString()+";\n"+e,r.compileDebug&&(e="rethrow = rethrow || "+g.toString()+";\n"+e)),r.strict&&(e='"use strict";\n'+e),r.debug&&console.log(e);try{if(r.async)try{n=new Function("return (async function(){}).constructor;")()}catch(e){throw e instanceof SyntaxError?new Error("This environment does not support async/await"):e}else n=Function;t=new n(r.localsName+", escapeFn, include, rethrow",e)}catch(e){throw e instanceof SyntaxError&&(r.filename&&(e.message+=" in "+r.filename),e.message+=" while compiling ejs\n\n",e.message+="If the above error is not helpful, you may want to try EJS-Lint:\n",e.message+="https://github.com/RyanZim/EJS-Lint",e.async||(e.message+="\n",e.message+="Or, if you meant to create an async function, pass async: true as an option.")),e}if(r.client)return t.dependencies=this.dependencies,t;var c=function(e){return t.apply(r.context,[e||{},a,function(t,n){var s=o.shallowCopy({},e);return n&&(s=o.shallowCopy(s,n)),function(e,t){var n=o.shallowCopy({},t);return n.filename=f(e,n),m(n)}(t,r)(s)},g])};return c.dependencies=this.dependencies,c},generateSource:function(){this.opts.rmWhitespace&&(this.templateText=this.templateText.replace(/\r/g,"").replace(/^\s+|\s+$/gm,"")),this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var e=this,n=this.parseTemplateText(),r=this.opts.delimiter;n&&n.length&&n.forEach(function(s,i){var a,c,u,l,p,m;if(0===s.indexOf("<"+r)&&0!==s.indexOf("<"+r+r)&&(c=n[i+2])!=r+">"&&c!="-"+r+">"&&c!="_"+r+">")throw new Error('Could not find matching close tag for "'+s+'".');if((u=s.match(/^\s*include\s+(\S+)/))&&(a=n[i-1])&&(a=="<"+r||a=="<"+r+"-"||a=="<"+r+"_"))return l=o.shallowCopy({},e.opts),p=function(e,t){var n,r,s=o.shallowCopy({},t);r=h(n=f(e,s)).toString().replace(d,""),s.filename=n;var i=new _(r,s);return i.generateSource(),{source:i.source,filename:n,template:r}}(u[1],l),m=e.opts.compileDebug?"    ; (function(){\n      var __line = 1\n      , __lines = "+JSON.stringify(p.template)+"\n      , __filename = "+JSON.stringify(p.filename)+";\n      try {\n"+p.source+"      } catch (e) {\n        rethrow(e, __lines, __filename, __line, escapeFn);\n      }\n    ; }).call(this)\n":"    ; (function(){\n"+p.source+"    ; }).call(this)\n",e.source+=m,void e.dependencies.push(t.resolveInclude(u[1],l.filename));e.scanLine(s)})},parseTemplateText:function(){for(var e,t=this.templateText,n=this.regex,r=n.exec(t),s=[];r;)0!==(e=r.index)&&(s.push(t.substring(0,e)),t=t.slice(e)),s.push(r[0]),t=t.slice(r[0].length),r=n.exec(t);return t&&s.push(t),s},_addOutput:function(e){if(this.truncate?(e=e.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1):this.opts.rmWhitespace&&(e=e.replace(/^\n/,"")),!e)return e;e=(e=(e=(e=e.replace(/\\/g,"\\\\")).replace(/\n/g,"\\n")).replace(/\r/g,"\\r")).replace(/"/g,'\\"'),this.source+='    ; __append("'+e+'")\n'},scanLine:function(e){var t,n=this.opts.delimiter;switch(t=e.split("\n").length-1,e){case"<"+n:case"<"+n+"_":this.mode=_.modes.EVAL;break;case"<"+n+"=":this.mode=_.modes.ESCAPED;break;case"<"+n+"-":this.mode=_.modes.RAW;break;case"<"+n+"#":this.mode=_.modes.COMMENT;break;case"<"+n+n:this.mode=_.modes.LITERAL,this.source+='    ; __append("'+e.replace("<"+n+n,"<"+n)+'")\n';break;case n+n+">":this.mode=_.modes.LITERAL,this.source+='    ; __append("'+e.replace(n+n+">",n+">")+'")\n';break;case n+">":case"-"+n+">":case"_"+n+">":this.mode==_.modes.LITERAL&&this._addOutput(e),this.mode=null,this.truncate=0===e.indexOf("-")||0===e.indexOf("_");break;default:if(this.mode){switch(this.mode){case _.modes.EVAL:case _.modes.ESCAPED:case _.modes.RAW:e.lastIndexOf("//")>e.lastIndexOf("\n")&&(e+="\n")}switch(this.mode){case _.modes.EVAL:this.source+="    ; "+e+"\n";break;case _.modes.ESCAPED:this.source+="    ; __append(escapeFn("+v(e)+"))\n";break;case _.modes.RAW:this.source+="    ; __append("+v(e)+")\n";break;case _.modes.COMMENT:break;case _.modes.LITERAL:this._addOutput(e)}}else this._addOutput(e)}this.opts.compileDebug&&t&&(this.currentLine+=t,this.source+="    ; __line = "+this.currentLine+"\n")}},t.escapeXML=o.escapeXML,t.__express=t.renderFile,t.VERSION=a,t.name="ejs","undefined"!=typeof window&&(window.ejs=t)},function(e,t){e.exports=require("express-partials")},function(e,t,n){const r=n(0);var s=n(21);n(7);const o=n(1),i=r();i.engine("html",n(20).renderFile),i.set("view engine","html"),i.set("views","assets"),i.use(s()),i.use(o.urlencoded({extended:!0})),i.use(o.json()),i.use(r.static("dist/assets")),i.use("/",n(16)),i.use("/api",n(15));var a=n(14);i.use("/api/auth",a);var c=n(11);i.use("/api/registrations",c);var u=n(9);i.use("/api/teachers",u);process.env.PORT;e.exports=i}]);