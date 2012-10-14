define("js/events",["require","exports","module"],function(e,t,n){function r(){var e=[];this.subscribe=function(t){typeof t=="function"&&e.push(t)},this.unsubscribe=function(t){if(typeof t!="function")return;var n=-1;for(var r=0,i=e.length;r<i;r++)if(e[r]===t){n=r;break}n>-1&&e.splice(n,1)},this.emit=function(){for(var t=0,n=e.length;t<n;t++)e[t].apply(this,Array.prototype.slice.call(arguments,0))}}function i(){var e={};this.emit=function(t){t&&e[t]&&e[t].emit.apply(this,Array.prototype.slice.call(arguments,1))},this.on=function(t,n){e[t]=e[t]||new r,e[t].subscribe(n)},this.off=function(t,n){e[t]&&e[t].unsubscribe(n)}}function s(e){var t=[],n=!1,r=[];if(typeof e!="function"){console.error("Promise condition should be a function"),n=!!e;return}this.check=function(){if(n)return;var i=Array.prototype.slice.call(arguments,0);if(e.apply(this,i)){n=!0,r=i;for(var s=0,o=t.length;s<o;s++)t[s].apply(this,i)}},this.success=function(e){if(!typeof e==="function")return;n?e.apply(this,r):t.push(e)}}t.Event=r,t.Emitter=i,t.Promise=s,t.Bus=new i}),define("js/model-factory",["require","exports","module","./events"],function(e,t,n){function s(e,t){return function(){t.apply(e,Array.prototype.slice.call(arguments,0))}}function o(e){return(e<10?"0":"")+e}function u(e){return e.getFullYear()+"-"+o(e.getMonth()+1)+"-"+o(e.getDate())}function f(e){var t=a.exec(e);if(t===null||t.length<4)return console.log("failed to parse an ISO date from ",e),undefined;var n=parseInt(t[1]),r=parseInt(t[2].replace(/^0*/,""))-1,i=parseInt(t[3].replace(/^0*/,""));return!n||!r||!i?(console.log("failed to parse an ISO date from ",e),undefined):new Date(n,r,i,0,0,0,0)}function l(e){var t=new Date(e),n=t.getDay();return t.setDate(t.getDate()-(n?n:7)+1),t}function c(e){var t=new Date(e),n=t.getDay();return n&&t.setDate(t.getDate()-n+7),t}function p(e){this.isoDate=u(e),this.display={day:h[e.getDay()],date:e.getDate()+"."+o(e.getMonth()+1)},this.lectures=[];var t=new r.Emitter;this.on=s(this,t.on),this.emit=s(this,t.emit),this.off=s(this,t.off)}function d(e){var t=this.monday=l(e),n=this.sunday=c(e),r=this.days=[];for(var i=new Date(t);i<=n;i.setDate(i.getDate()+1))r.push(new p(i))}function v(e){function c(e){e.date||console.error("can't add a lecture without date!");var t=p(e.date),n=t.add(e);l("lecture.add",e,t,n)}function h(e){e.date||console.error("can't remove lecture without a date!");var t=p(e.date),n=t.remove(e);l("lecture.remove",e,t,n)}function p(e){var t=f(e),r;if(!o&&!u)r=v(t);else{while(o>t)r=m();while(u<t)r=g();if(!r){var i=0;do r=n[i++];while(!r.contains(t))}}return r&&r.day(t)}function v(e){var t=new d(e);return n.push(t),o=new Date(t.monday),u=new Date(t.sunday),l("week.append",t),t}function m(){o.setDate(o.getDate()-7);var e=new d(o);return n.splice(0,0,e),l("week.prepend",e),e}function g(){u.setDate(u.getDate()+7);var e=new d(u);return n.push(e),l("week.append",e),e}function b(){y.weeks=n=[],o=u=undefined,l("clear")}function w(e){n.length&&b();var t=l;l=function(){};if(e&&e.length)for(var r=0,s=e.length;r<s;r++)c(e[r]);if(i&&i.viewport){n.length||v(new Date);while(n.length<i.viewport)g()}l=t,l("init")}function E(){var e=[];for(var t=0,r=n.length;t<r;t++)for(var i=0,s=n[t].days.length;i<s;i++)for(var o=0,u=n[t].days[i].lectures.length;o<u;o++)e.push(n[t].days[i].lectures[o]);return e}var t=[],n=[],o,u,a=new r.Emitter,l=s(this,a.emit),y=this;this.weeks=n,this.appendWeek=g,this.prependWeek=m,this.lectures=E,this.add=c,this.remove=h,this.init=w,this.on=s(this,a.on),this.off=s(this,a.off),w(e)}var r=e("./events"),i=n.config(),a=/\s*(\d+)-(\d+)-(\d+)\s*/,h=["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];p.prototype.add=function(e){var t=this.lectures,n=t.length,r=0;while(r<n&&t[r].start<e.start)r++;return t.splice(r,0,e),this.emit("add",r,e),r},p.prototype.remove=function(e){var t=this.lectures,n=t.length,r=0;while(r<n&&t[r]!==e)r++;return r<n?(this.emit("remove",r,t.splice(r,1)),r):-1},d.prototype.contains=function(e){return this.monday<=e&&this.sunday>=e},d.prototype.day=function(e){if(this.contains(e))return this.days[(e.getDay()+6)%7]},t.Model=v}),define("js/global",["require"],function(e){return window}),define("js/storage",["require","exports","module","./global"],function(e,t,n){function o(e){return typeof e=="string"?e:i.stringify(e)}function u(e){return e?i.parse(e):e}var r=e("./global"),i=r.JSON,s=r.localStorage;s&&i?(t.supported=!0,t.has=function(e){return typeof s.getItem(e)=="string"},t.get=function(e){return u(s.getItem(e))},t.set=function(e,t){s.setItem(e,o(t))},t.remove=function(e){s.removeItem(e)}):t.supported=!1}),define("js/templates",["require","exports","module","handlebars","./events"],function(e,t,n){function u(e){if(!Handlebars){console.error("Handlebars is missing from the global scope");return}var n,r={"(":"{",")":"}"};while(n=o.exec(e))for(var i=0,u=n.length;i<u;i++)t[n[1]]=Handlebars.compile(n[2].replace(/[\(\)]/g,function(e){return r[e]||e})),s.check()}e("handlebars");var r=e("./events"),i=n.config().required,s=new r.Promise(function(){if(!i&&!i.length)return!0;for(var e=0,n=i.length;e<n;e++)if(!t[i[e]])return!1;return!0}),o=/<!--\s*([\w$-]+)\s*-->\s*([\s\S]+?)\s*(?=<!--\s*[\w$-]+\s*-->|$)/g;e(["text!templates/templates.html"],function(e){e&&u(e)}),t.ready=s}),define("js/ui/layout",["require","exports","module","jquery","js/templates","js/events"],function(e,t,n){function a(e,t){var n=r(i.day(t)),s=n.find(".b-curriculum__lectures-list");_dayLectures[t.isoDate]=s,r.each(t.lectures,function(e,t){u.add(s,t,-1)}),e.append(n),o.emit.call(n,"new.day",t)}function f(e,t,n){n=n||"append";var s=r(i.week(t));r.each(t.days,function(e,t){a(s,t)}),e[n](s),o.emit.call(s,"new.week",t)}function l(e,t){r.each(t.weeks,function(t,n){f(e,n)}),o.emit.call(e,"init",t)}function p(e){i.ready.success(function(){if(!e.weeks.length)return;if(!h||!h["static"])e.on("clear",function(){_dayLectures=[],c.empty(),o.emit.call(c,"clear")}),e.on("init",function(){l(c,this)}),e.on("week.prepend",function(e){f(c,e,"prepend")}),e.on("week.append",function(e){f(c,e,"append")}),e.on("lecture.add",function(e,t,n){u.add(_dayLectures[t.isoDate],e,n)}),e.on("lecture.remove",function(e,t,n){u.remove(_dayLectures[t.isoDate],e,n)});l(c,e)})}var r=e("jquery"),i=e("js/templates"),s=e("js/events"),o=new s.Emitter,u={add:function(e,t,n){var s=r(i.lecture(t)),u=e.children();return n>=0&&n<u.length?r(u[n]).before(s):e.append(s),o.emit.call(s,"new.lecture",t),s},remove:function(e,t,n){var i=e.children();n>=0&&n<=i.length&&(r(i[n]).remove(),o.emit.call(e,"removed.lecture",t))}};_dayLectures={};var c=r(".b-curriculum"),h=n.config();t.init=p,t.on=o.on,t.off=o.off}),define("js/print",["require","exports","module","jquery","./model-factory","./storage","./ui/layout"],function(e,t,n){e("jquery");var r=e("./model-factory"),i=e("./storage"),s=e("./ui/layout"),o=i.get("modeldata");o?s.init(new r.Model(o)):$(function(){$("body").addClass("b-page_state_nodata")})})