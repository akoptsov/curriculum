define(["require","exports","module","jquery","./model-factory","./storage","./ui/layout"],function(e,t,n){e("jquery");var r=e("./model-factory"),i=e("./storage"),s=e("./ui/layout"),o=i.get("modeldata");o?s.init(new r.Model(o)):$(function(){$("body").addClass("b-page_state_nodata")})})