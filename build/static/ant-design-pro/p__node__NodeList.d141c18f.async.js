(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[262],{78463:function(K,E,e){"use strict";var c=e(85893);E.Z=function(h){return(0,c.jsx)("div",{children:(0,c.jsx)("h2",{style:{marginBottom:"20px"},children:h.title})})}},3484:function(K,E,e){"use strict";e.r(E);var c=e(71194),h=e(5644),u=e(47673),m=e(1011),W=e(89816),I=e(6109),R=e(82471),p=e(84283),U=e(49111),T=e(19650),Z=e(57663),o=e(71577),_=e(34792),t=e(48086),a=e(2824),n=e(67294),s=e(73755),i=e(78463),g=e(30381),C=e.n(g),B=e(73171),r=e(85893);E.default=function(){var H=(0,n.useState)([]),j=(0,a.Z)(H,2),z=j[0],J=j[1],G=(0,n.useState)(1),w=(0,a.Z)(G,2),A=w[0],V=w[1],Q=(0,n.useState)(0),N=(0,a.Z)(Q,2),X=N[0],q=N[1],ee=(0,n.useState)(new Map),b=(0,a.Z)(ee,2),y=b[0],te=b[1],ae=(0,n.useState)(!1),Y=(0,a.Z)(ae,2),ne=Y[0],v=Y[1],re=(0,n.useState)(!1),F=(0,a.Z)(re,2),se=F[0],L=F[1],_e=(0,n.useState)(!1),$=(0,a.Z)(_e,2),oe=$[0],k=$[1],P=function(d){v(!0),(0,s.bS)(d,9,"SHARE").then(function(l){if(l.code===200){var O=new Map,x=new Map;l.data.data.forEach(function(M){O.set(M.id,M),x.set(M.id,!1)}),te(O),J(l.data.data),V(d),q(l.data.total)}else t.default.error(l.message);v(!1)})};(0,n.useEffect)(function(){P(1)},[]);var de=[{title:"ID",dataIndex:"id",key:"id"},{title:"Host",dataIndex:"host",key:"host"},{title:"Create Time",dataIndex:"createTime",key:"createTime",render:function(d){return C()(d*1e3).format()}},{title:"If Approved",dataIndex:"ifApproved",key:"ifApproved",render:function(d){return d?"Approved":"Forbidden"}},{title:"Action",dataIndex:"id",key:"action",render:function(d){var l,O=function(){v(!0),(0,s.gY)(d,!y.get(d).ifApproved).then(function(D){D.code===200?(t.default.success("Change successfully!"),P(A)):t.default.error(D.message),v(!1)})},x=function(){v(!0),(0,s.IK)(d).then(function(D){D.code===200?(t.default.success("Delete successfully!"),P(A)):t.default.error(D.message),v(!1)})},M=(l=y.get(d))===null||l===void 0?void 0:l.ifApproved;return y.get(d)?(0,r.jsxs)(T.Z,{children:[M?(0,r.jsx)(o.Z,{type:"default",onClick:O,danger:!0,children:"Forbid"}):(0,r.jsx)(o.Z,{type:"default",onClick:O,children:"Permit"}),(0,r.jsx)(o.Z,{type:"primary",onClick:x,danger:!0,children:(0,r.jsx)(B.Z,{})})]}):(0,r.jsx)(r.Fragment,{})}}],ue=p.Z.useForm(),ie=(0,a.Z)(ue,1),S=ie[0];return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.Z,{title:"Share Node List"}),(0,r.jsx)(o.Z,{type:"primary",onClick:function(){L(!0)},style:{width:"150px",marginBottom:"20px"},children:"Create Node"}),(0,r.jsx)(I.Z,{dataSource:z,columns:de,loading:ne,pagination:{defaultPageSize:9,defaultCurrent:A,total:X,showSizeChanger:!1,onChange:function(d){P(d)}}}),(0,r.jsx)(h.Z,{title:"Create New Share Node",visible:se,okButtonProps:{loading:oe},onOk:function(){S.submit()},onCancel:function(){L(!1)},children:(0,r.jsxs)(p.Z,{form:S,onFinish:function(d){k(!0),(0,s.dS)(d.host,d.password,"SHARE","","","",d.nodeId).then(function(l){l.code===200?(t.default.success("Create successfully!"),L(!1),S.resetFields(),P(A)):t.default.error(l.message),k(!1)})},children:[(0,r.jsx)(p.Z.Item,{label:"Host Address",name:"host",rules:[{required:!0}],children:(0,r.jsx)(m.Z,{type:"text"})}),(0,r.jsx)(p.Z.Item,{label:"Access Password",name:"password",rules:[{required:!0}],children:(0,r.jsx)(m.Z,{type:"password"})}),(0,r.jsx)(p.Z.Item,{label:"If Set a Specific ID",name:"nodeId",children:(0,r.jsx)(m.Z,{type:"text",placeholder:"Leave blank to generate a new ID"})})]})})]})}},73755:function(K,E,e){"use strict";e.d(E,{sK:function(){return W},f5:function(){return I},uV:function(){return R},bS:function(){return p},dS:function(){return U},IK:function(){return T},gY:function(){return Z}});var c=e(3182),h=e(94043),u=e.n(h),m=e(21010),W=function(){var o=(0,c.Z)(u().mark(function _(t,a){return u().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,m.WY)("/service/admin/list/",{method:"GET",params:{current:t,pageSize:a}}));case 1:case"end":return s.stop()}},_)}));return function(t,a){return o.apply(this,arguments)}}(),I=function(){var o=(0,c.Z)(u().mark(function _(t,a){return u().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,m.WY)("/service/admin/password/"+t+"/",{method:"POST",data:{password:a}}));case 1:case"end":return s.stop()}},_)}));return function(t,a){return o.apply(this,arguments)}}(),R=function(){var o=(0,c.Z)(u().mark(function _(t,a){return u().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,m.WY)("/service/admin/create/",{method:"POST",data:{username:t,password:a}}));case 1:case"end":return s.stop()}},_)}));return function(t,a){return o.apply(this,arguments)}}(),p=function(){var o=(0,c.Z)(u().mark(function _(t,a,n){return u().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.abrupt("return",(0,m.WY)("/service/admin/node/list/"+n+"/",{method:"GET",params:{current:t,pageSize:a}}));case 1:case"end":return i.stop()}},_)}));return function(t,a,n){return o.apply(this,arguments)}}(),U=function(){var o=(0,c.Z)(u().mark(function _(t,a,n,s,i,g,C){return u().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",(0,m.WY)("/service/admin/node/create/"+n+"/",{method:"POST",data:{host:t,password:a,username:s,authorUrl:i,postUrl:g,nodeId:C}}));case 1:case"end":return r.stop()}},_)}));return function(t,a,n,s,i,g,C){return o.apply(this,arguments)}}(),T=function(){var o=(0,c.Z)(u().mark(function _(t){return u().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,m.WY)("/service/admin/node/delete/"+t+"/",{method:"DELETE"}));case 1:case"end":return n.stop()}},_)}));return function(t){return o.apply(this,arguments)}}(),Z=function(){var o=(0,c.Z)(u().mark(function _(t,a){var n;return u().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return n=a?"1":"0",i.abrupt("return",(0,m.WY)("/service/admin/node/approved/"+t+"/",{method:"POST",data:{approved:n}}));case 2:case"end":return i.stop()}},_)}));return function(t,a){return o.apply(this,arguments)}}()}}]);
