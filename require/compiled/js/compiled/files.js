define(["require","exports","module","./global"],function(e,t,n){function o(e){var t=new s;t.append(e);var n=t.getBlob("application/octet-stream");return i.createObjectURL(n)}var r=e("./global"),i=r.URL||r.webkitURL,s=r.BlobBuilder||r.WebKitBlobBuilder||r.MozBlobBuilder||r.MSBlobBuilder;this.supported=i&&s,this.href=o})