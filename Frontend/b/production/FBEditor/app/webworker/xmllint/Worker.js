addEventListener("message",function(b){var a=b.data,c;c=self._worker||new W();self._worker=c;if(!a){c.init()}else{c.message(a)}},false);function W(){return{data:null,init:function(){var a=this;self.importScripts("lib/index.js");a.data=true;a.post()},message:function(b){var a=this;a.data=b;if(self.validateXML){a.valid();b.loaded=true}else{b.valid="xmllint не загружен";b.res=false;b.loaded=false}a.post()},post:function(){var b=this,a;a={masterName:"xmllint",data:b.data};self.postMessage(a)},valid:function(){var e=this,f=e.data,c,d,b,a;b={xml:f.xml,schema:f.xsd,arguments:["--noout","--schema",f.schemaFileName,f.xmlFileName]};d=validateXML(b);c=new RegExp("^("+f.schemaFileName+"|"+f.xmlFileName+"):[0-9]+","i");a=!c.test(d);f.valid=d;f.res=a}}};