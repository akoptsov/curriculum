define(["require","exports","module"],function(e,t,n){function r(){var e=[];this.subscribe=function(t){typeof t=="function"&&e.push(t)},this.unsubscribe=function(t){if(typeof t!="function")return;var n=-1;for(var r=0,i=e.length;r<i;r++)if(e[r]===t){n=r;break}n>-1&&e.splice(n,1)},this.emit=function(){for(var t=0,n=e.length;t<n;t++)e[t].apply(this,Array.prototype.slice.call(arguments,0))}}function i(){var e={};this.emit=function(t){t&&e[t]&&e[t].emit.apply(this,Array.prototype.slice.call(arguments,1))},this.on=function(t,n){e[t]=e[t]||new r,e[t].subscribe(n)},this.off=function(t,n){e[t]&&e[t].unsubscribe(n)}}function s(e){var t=[],n=!1,r=[];if(typeof e!="function"){console.error("Promise condition should be a function"),n=!!e;return}this.check=function(){if(n)return;var i=Array.prototype.slice.call(arguments,0);if(e.apply(this,i)){n=!0,r=i;for(var s=0,o=t.length;s<o;s++)t[s].apply(this,i)}},this.success=function(e){if(!typeof e==="function")return;n?e.apply(this,r):t.push(e)}}t.Event=r,t.Emitter=i,t.Promise=s,t.Bus=new i})