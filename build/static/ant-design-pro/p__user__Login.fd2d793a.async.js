(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[531],{34687:function(v){v.exports={container:"container___1sYa-",lang:"lang___l6cji",content:"content___2zk1-",icon:"icon___rzGKO"}},19319:function(v,M,e){"use strict";e.r(M);var Q=e(18106),O=e(47428),X=e(34792),D=e(48086),m=e(11849),f=e(3182),h=e(2824),k=e(17462),I=e(76772),K=e(94043),l=e.n(K),B=e(89366),R=e(2603),C=e(67294),A=e(99861),L=e(81209),n=e(21010),W=e(29791),x=e(36571),S=e(34687),u=e.n(S),a=e(85893),Z=function(P){var c=P.content;return(0,a.jsx)(I.Z,{style:{marginBottom:24},message:c,type:"error",showIcon:!0})},b=function(){var P=(0,C.useState)({}),c=(0,h.Z)(P,2),U=c[0],Y=c[1],J=(0,C.useState)("account"),T=(0,h.Z)(J,2),p=T[0],N=T[1],j=(0,n.tT)("@@initialState"),E=j.initialState,z=j.setInitialState,y=(0,n.YB)(),$=function(){var d=(0,f.Z)(l().mark(function t(){var i,r;return l().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,E==null||(i=E.fetchUserInfo)===null||i===void 0?void 0:i.call(E);case 2:if(r=_.sent,!r){_.next=6;break}return _.next=6,z(function(g){return(0,m.Z)((0,m.Z)({},g),{},{currentUser:r})});case 6:case"end":return _.stop()}},t)}));return function(){return d.apply(this,arguments)}}(),G=function(){var d=(0,f.Z)(l().mark(function t(i){var r,o,_,g;return l().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.prev=0,s.next=3,(0,x.x4)((0,m.Z)((0,m.Z)({},i),{},{type:p}));case 3:if(r=s.sent,r.status!=="ok"){s.next=14;break}return D.default.success("Login successfully."),s.next=8,$();case 8:if(n.m8){s.next=10;break}return s.abrupt("return");case 10:return o=n.m8.location.query,_=o,g=_.redirect,n.m8.push(g||"/"),s.abrupt("return");case 14:console.log(r),Y(r),s.next=21;break;case 18:s.prev=18,s.t0=s.catch(0),D.default.error("Login failure! Please retry.");case 21:case"end":return s.stop()}},t,null,[[0,18]])}));return function(i){return d.apply(this,arguments)}}(),H=U.status,V=U.type;return(0,a.jsxs)("div",{className:u().container,children:[(0,a.jsx)("div",{className:u().lang,"data-lang":!0,children:n.pD&&(0,a.jsx)(n.pD,{})}),(0,a.jsx)("div",{className:u().content,children:(0,a.jsxs)(A.Z,{logo:(0,a.jsx)("img",{alt:"logo",src:"/logo.svg"}),title:"Social Platform Admin Login",initialValues:{autoLogin:!0},onFinish:function(){var d=(0,f.Z)(l().mark(function t(i){return l().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.next=2,G(i);case 2:case"end":return o.stop()}},t)}));return function(t){return d.apply(this,arguments)}}(),children:[(0,a.jsx)(O.Z,{activeKey:p,onChange:N,children:(0,a.jsx)(O.Z.TabPane,{tab:y.formatMessage({id:"pages.login.accountLogin.tab",defaultMessage:"\u8D26\u6237\u5BC6\u7801\u767B\u5F55"})},"account")}),H==="error"&&V==="account"&&(0,a.jsx)(Z,{content:y.formatMessage({id:"pages.login.accountLogin.errorMessage",defaultMessage:"\u8D26\u6237\u6216\u5BC6\u7801\u9519\u8BEF(admin/ant.design)"})}),p==="account"&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(L.Z,{name:"username",fieldProps:{size:"large",prefix:(0,a.jsx)(B.Z,{className:u().prefixIcon})},placeholder:"Username",rules:[{required:!0,message:(0,a.jsx)(n._H,{id:"pages.login.username.required",defaultMessage:"\u8BF7\u8F93\u5165\u7528\u6237\u540D!"})}]}),(0,a.jsx)(L.Z.Password,{name:"password",fieldProps:{size:"large",prefix:(0,a.jsx)(R.Z,{className:u().prefixIcon})},placeholder:"Password",rules:[{required:!0,message:(0,a.jsx)(n._H,{id:"pages.login.password.required",defaultMessage:"\u8BF7\u8F93\u5165\u5BC6\u7801\uFF01"})}]})]}),(0,a.jsx)("div",{style:{marginBottom:24}})]})}),(0,a.jsx)(W.Z,{})]})};M.default=b}}]);