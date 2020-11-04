(this["webpackJsonpstudent-app"]=this["webpackJsonpstudent-app"]||[]).push([[0],{146:function(e,t){},148:function(e,t){},162:function(e,t){},164:function(e,t){},192:function(e,t){},194:function(e,t){},195:function(e,t){},201:function(e,t){},203:function(e,t){},221:function(e,t){},223:function(e,t){},235:function(e,t){},238:function(e,t){},259:function(e,t,n){},260:function(e,t,n){"use strict";n.r(t);var c={};n.r(c),n.d(c,"name",(function(){return g})),n.d(c,"id",(function(){return z})),n.d(c,"Page",(function(){return k})),n.d(c,"POTDPreview",(function(){return y})),n.d(c,"ListPreview",(function(){return N}));var r={};n.r(r),n.d(r,"Page",(function(){return J})),n.d(r,"name",(function(){return F})),n.d(r,"id",(function(){return I})),n.d(r,"ListPreview",(function(){return q}));var a=n(10),s=n(0),o=n(1),i=n.n(o),u=n(133),l=n.n(u),d=n(70),j=n(5),b=n(136),h=n(8),f=n.n(h),p=n(15),v=n(134),O=n.n(v),x=i.a.createContext({user:null,setUser:function(){}});function m(e){var t=Object(o.useState)(),n=Object(a.a)(t,2),c=n[0],r=n[1],i=Object(o.useState)(),u=Object(a.a)(i,2),l=u[0],d=u[1],j=Object(o.useContext)(x).setUser,b=function(e,t){e(t.target.value)},h=function(){var t=Object(p.a)(f.a.mark((function t(n){var r,a,s,o,i,u;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={first:c,last:l},a="".concat("https://immense-everglades-63113.herokuapp.com/api","/students")+(n?"":"/login"),t.next=4,fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});case 4:if(!(s=t.sent).ok){t.next=20;break}return t.prev=6,t.next=9,s.json();case 9:o=t.sent.token,i=O.a.decode(o),u=i.student,j({token:o,student:u}),e.history.push("/"),t.next=18;break;case 15:t.prev=15,t.t0=t.catch(6),console.log(t.t0);case 18:t.next=21;break;case 20:console.log("HTTP error, status = "+s.status);case 21:case"end":return t.stop()}}),t,null,[[6,15]])})));return function(e){return t.apply(this,arguments)}}();return Object(s.jsx)("div",{className:"login-container",children:Object(s.jsxs)("div",{className:"login-window",children:[Object(s.jsxs)("div",{className:"name-container first",children:[Object(s.jsx)("label",{htmlFor:"firstname",children:"First Name:"}),Object(s.jsx)("input",{type:"text",name:"firstname",id:"firstname",onChange:b.bind(null,r)})]}),Object(s.jsxs)("div",{className:"name-container last",children:[Object(s.jsx)("label",{htmlFor:"lastname",children:"Last Name:"}),Object(s.jsx)("input",{type:"text",name:"lasname",id:"lasname",onChange:b.bind(null,d)})]}),Object(s.jsx)("button",{className:"create-student",onClick:function(){return h(!0)},children:"Create"}),Object(s.jsx)("button",{className:"login-student",onClick:function(){return h(!1)},children:"Log-In"})]})})}function k(e){var t=Object(o.useState)(!1),n=Object(a.a)(t,2),c=n[0],r=n[1],i=Object(o.useState)(!1),u=Object(a.a)(i,2),l=u[0],d=u[1],j=Object(o.useContext)(x).user.token,b="".concat("https://immense-everglades-63113.herokuapp.com/api","/puzzles/Test/0");return Object(o.useEffect)((function(){l||Object(p.a)(f.a.mark((function e(){var t,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(b,{method:"GET",headers:{authorization:j}});case 2:if(!(t=e.sent).ok){e.next=17;break}return e.prev=4,e.next=7,t.json();case 7:n=e.sent,r(n.work.solved),d(!0),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(4),console.log(e.t0);case 15:e.next=18;break;case 17:console.log("HTTP error, status = "+t.status);case 18:case"end":return e.stop()}}),e,null,[[4,12]])})))()})),Object(s.jsxs)("div",{children:[Object(s.jsx)("h1",{children:"Test Puzzle"}),l?Object(s.jsxs)("p",{children:[Object(s.jsx)("label",{htmlFor:"testsolved",children:"Solved: "}),Object(s.jsx)("input",{type:"checkbox",name:"testsolved",id:"testsolved",defaultChecked:c,onClick:function(e){console.log(e.target.checked);var t=e.target.checked;!function(e,t,n){w.apply(this,arguments)}(j,{solved:t},b),r(t)}})]}):null]})}function w(){return(w=Object(p.a)(f.a.mark((function e(t,n,c){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(c,{method:"PUT",headers:{"Content-Type":"application/json",authorization:t},body:JSON.stringify({puzzleData:n})});case 2:e.sent;case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var g="Test Puzzle",z="test";function y(){return Object(s.jsx)("div",{className:"potd-preview",children:"Test puzzle! Is it solved????"})}function N(){return Object(s.jsx)("div",{className:"list-preview",children:"Solved?"})}var C=n(35);function T(e){var t=e.history,n=e.instanceList;return Object(s.jsx)("div",{className:"calcudoku-page-container",children:Object(s.jsxs)("div",{className:"instance-list-container",children:[Object(s.jsx)("h2",{children:"Calcudokus"}),Object(s.jsx)("ul",{children:n?n.map(P.bind(null,t)):null})]})})}function P(e,t){return Object(s.jsx)("li",{onClick:function(){return e.push("/calcudoku/".concat(t))},children:Object(s.jsx)("h3",{children:(n=t,n.replace(/^./,(function(e){return e.toUpperCase()})))})},t);var n}var S=n(73);function E(e){var t=e.name,n=Object(o.useState)(null),c=Object(a.a)(n,2),r=c[0],i=c[1],u=Object(o.useState)(null),l=Object(a.a)(u,2),d=l[0],j=l[1],b=Object(o.useState)(null),h=Object(a.a)(b,2),v=h[0],O=h[1],m=Object(o.useContext)(x).user.token,k="".concat("https://immense-everglades-63113.herokuapp.com/api","/puzzles/calcudoku/").concat(t);Object(o.useEffect)((function(){Object(p.a)(f.a.mark((function e(){var t,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(k,{method:"GET",headers:{authorization:m}});case 2:if(!(t=e.sent).ok){e.next=18;break}return e.prev=4,e.next=7,t.json();case 7:n=e.sent,i(n.size),j(L(n)),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(4),j([]),console.log(e.t0);case 16:e.next=19;break;case 18:console.log("HTTP error, status = "+t.status);case 19:case"end":return e.stop()}}),e,null,[[4,12]])})))()}),[k,m]),Object(o.useEffect)((function(){var e="".concat("https://immense-everglades-63113.herokuapp.com/api","/activepuzzle");return Object(p.a)(f.a.mark((function n(){var c;return f.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch(e,{method:"PUT",headers:{"Content-Type":"application/json",authorization:m},body:JSON.stringify({puzzleName:"calcudoku",puzzleId:t})});case 2:c=n.sent,console.log(c.status);case 4:case"end":return n.stop()}}),n)})))(),function(){fetch(e,{method:"DELETE",headers:{authorization:m}})}}),[m,t]);var w=function(){var e=Object(p.a)(f.a.mark((function e(){var t,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=d.map((function(e){return{col:e.col,row:e.row,value:e.value}})),e.next=3,fetch(k,{method:"PUT",headers:{"Content-Type":"application/json",authorization:m},body:JSON.stringify({puzzleData:t})});case 3:n=e.sent,console.log(n.status);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),g=function(e){var t=e.key;v&&(["Backspace","Delete"].includes(t)?v.value="":!isNaN(t)&&1<=t&&t<=r&&(v.value=t),j(Object(S.a)(d)),w())};Object(o.useEffect)((function(){return window.addEventListener("keydown",g),function(){return window.removeEventListener("keydown",g)}}));var z=function(e){return Object(s.jsx)("button",{className:"number-select",onClick:function(){v.value=e,j(Object(S.a)(d)),w()},children:e},"num".concat(e))};return Object(s.jsx)("div",{children:d?Object(s.jsxs)("div",{className:"puzzle-container",size:r,children:[Object(s.jsx)("div",{className:"grid-container",size:r,children:d.map((function(e){var t="calcudoku-square "+e.neighbors.join(" ")+(e===v?" active":"");return Object(s.jsxs)("div",{className:t,onClick:function(){return O(e)},children:[Object(s.jsxs)("div",{className:"cage-indicator",children:[e.result,e.operation]}),Object(s.jsx)("input",{type:"number",value:e.value||"",disabled:!0})]})}))}),Object(s.jsx)("div",{className:"number-select-container",children:new Array(r).fill(null).map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var c=t[1];return z(c+1)}))})]}):null})}function L(e){var t=e.size,n=e.cages,c=e.work;return Array(Math.pow(t,2)).fill(null).map((function(){for(var e=arguments.length,r=new Array(e),a=0;a<e;a++)r[a]=arguments[a];var s=r[1],o=Math.floor(s/t),i=s%t,u=D({col:o,row:i}),l=c.find(u),d=n.find((function(e){return e.squares.find(u)})),j=U({col:o,row:i},d),b=d.squares.every((function(e){return e.col>=o&&e.row>=i})),h=b?d.result:null,f=b?d.operation:null,p=l?l.value:null;return{col:o,row:i,value:p,neighbors:j,result:h,operation:f}}))}function U(e,t){var n=[],c={"n-up":{col:e.col-1,row:e.row},"n-down":{col:e.col+1,row:e.row},"n-left":{col:e.col,row:e.row-1},"n-right":{col:e.col,row:e.row+1}};for(var r in c){var a=D(c[r]);t.squares.find(a)&&n.push(r)}return n}function D(e){var t=e.col,n=e.row;return function(e){return e.col===t&&e.row===n}}function J(e){var t=Object(o.useState)([]),n=Object(a.a)(t,2),c=n[0],r=n[1],i=Object(o.useContext)(x).user.token,u=e.match;Object(o.useEffect)((function(){Object(p.a)(f.a.mark((function e(){var t,n,c;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="".concat("https://immense-everglades-63113.herokuapp.com/api","/puzzles/calcudoku/"),e.next=3,fetch(t,{method:"GET",headers:{authorization:i}});case 3:if(!(n=e.sent).ok){e.next=17;break}return e.prev=5,e.next=8,n.json();case 8:c=e.sent,r(c),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),console.log(e.t0);case 15:e.next=18;break;case 17:console.log("HTTP error, status = "+n.status);case 18:case"end":return e.stop()}}),e,null,[[5,12]])})))()}),[i]);return Object(s.jsxs)(j.d,{children:[c?c.map(function(e,t){return Object(s.jsx)(j.b,{path:"".concat(e.url,"/").concat(t),render:function(e){return Object(s.jsx)(E,Object(C.a)(Object(C.a)({},e),{},{name:t}))}},t)}.bind(null,u)):null,Object(s.jsx)(j.b,{exact:!0,path:u.url,render:function(e){return Object(s.jsx)(T,Object(C.a)(Object(C.a)({},e),{},{instanceList:c}))}})]})}var F="Calcudokus",I="calcudoku";function q(){return Object(s.jsx)("div",{className:"list-preview",children:"Find all calcudokus here"})}var A=[r,c],H="/calcudoku/sample",B=function(){return Object(s.jsx)("div",{className:"potd-preview",children:"Like Sudokus, but with a twist!"})};function G(e){var t=e.history,n=Object(o.useContext)(x).user.token;return Object(s.jsxs)("div",{className:"dashboard-container",children:[Object(s.jsx)(M,{history:t,token:n}),Object(s.jsxs)("div",{className:"puzzle-list-container",children:[Object(s.jsx)("h2",{children:"Individual Work"}),Object(s.jsx)("ul",{children:A.map(W.bind(null,t,n))})]})]})}function M(e){var t=B;return Object(s.jsxs)("div",{className:"potd-container",onClick:function(){return e.history.push(H,{token:e.token})},children:[Object(s.jsx)("h2",{children:"Puzzle of the Day"}),Object(s.jsx)(t,{})]})}function W(e,t,n){return Object(s.jsxs)("li",{onClick:function(){return e.push("/".concat(n.id),{token:t})},children:[Object(s.jsx)("h3",{children:n.name}),n.ListPreview()]},n.id)}n(259);var K=Object(b.a)();function Q(){var e=Object(o.useState)(null),t=Object(a.a)(e,2),n=t[0],c=t[1],r={user:n,setUser:c};return Object(s.jsx)(d.a,{history:K,children:Object(s.jsx)(x.Provider,{value:r,children:n?Object(s.jsxs)("div",{children:[Object(s.jsxs)("nav",{className:"main-nav",children:[Object(s.jsx)(R,{history:K}),Object(s.jsx)(V,{student:n.student,setUser:c})]}),Object(s.jsxs)(j.d,{children:[A.map(X),Object(s.jsx)(j.b,{path:"/login",component:m}),Object(s.jsx)(j.b,{path:"/",component:G})]})]}):Object(s.jsxs)(j.d,{children:[Object(s.jsx)(j.b,{path:"/login",component:m}),Object(s.jsx)(j.b,{path:"/",children:Object(s.jsx)(j.a,{to:"/login"})})]})})})}function R(e){var t=e.history;return Object(s.jsx)("button",{className:"back-button",onClick:t.back,children:"Back"})}function V(e){var t=e.student,n=e.setUser;return Object(s.jsxs)("div",{className:"profile-bar",children:[Object(s.jsxs)("span",{className:"student-name",children:[Y(t.first)," ",Y(t.last)]}),Object(s.jsx)("button",{onClick:function(){return n(null)},className:"log-out",children:"Log Out"})]})}function X(e){return Object(s.jsx)(j.b,{path:"/".concat(e.id),component:e.Page},e.id)}function Y(e){return e.replace(/^./,(function(e){return e.toUpperCase()}))}l.a.render(Object(s.jsx)(i.a.StrictMode,{children:Object(s.jsx)(Q,{})}),document.getElementById("root"))}},[[260,1,2]]]);
//# sourceMappingURL=main.15f8c368.chunk.js.map