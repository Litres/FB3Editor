addEventListener("message",function(b){var a=b.data,c;c=self._worker||new W();self._worker=c;if(!a){c.init()}else{c.message(a)}},false);function W(){return{data:null,init:function(){var a=this;a.data=true;a.post()},message:function(b){var a=this;a.data=b;if(b.abort){a.abort()}else{a.send()}},post:function(){var b=this,a;a={masterName:"httpRequest",data:b.data};self.postMessage(a);self.close()},send:function(){var a=this,b=a.data,c,d;b.method=b.method||"GET";c=new Date().getTime();b.url+=/[?]/.test(b.url)?"&_d="+c:"?_d="+c;d=a.getXmlHttp();self._transport=d;d.open(b.method,b.url,true);d.responseType=b.responseType||"text";if(b.responseType==="arraybuffer"){if(Uint8Array){d.responseType="arraybuffer"}else{if(d.overrideMimeType){d.overrideMimeType("text/plain; charset=x-user-defined")}}}d.onreadystatechange=function(){if(d.readyState==4){b.response=d.response;b.status=d.status;b.statusText=d.statusText;a.post()}};d.send()},abort:function(){var a=this,b;b=self._transport;if(b){a.data.state=b.readyState;b.abort()}self.close()},getXmlHttp:function(){try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(b){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(a){}}if(typeof XMLHttpRequest!==undefined){return new XMLHttpRequest()}}}};