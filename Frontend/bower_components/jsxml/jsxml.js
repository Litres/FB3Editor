/*
 JSXML
  start 0.2.2 (2012-07-18)
 {@link http://JSXML.net/ orginal project}
 {@link http://ittown.info/jsxml/#!/api/JSXML DOCumentation}

 JavaScript XML/XSLT Library

 Copyright (c) 2007-2012, Anton Zorko
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the <organization> nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * для работы с XML,XSLT + трансформация в результирующий DOM<br/>
 * JavaScript XML/XSLT library.<br/>
 * [Original project](http://jsxml.net/)<br/>
 * @class JSXML
 * @singleton
 * **Feedback**<br/> Any comments, bug reports, suggestions — please welcome: [author](mailto:eugene@greendrake.info?subject=JSXML), [editor](mailto:cybermerlin@ya.ru?subject=JSXML).
 * <br/>Demo:<br/>
 *
 *    @example <code><pre>
 *    var xml = '&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;root/&gt;';
 *    var xsl = '&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;xsl:stylesheet xmlns:xsl=&quot;http://www.w3.org/1999/XSL/Transform&quot; version=&quot;1.0&quot;&gt;
 *                		&lt;xsl:output encoding=&quot;UTF-8&quot; indent=&quot;yes&quot; method=&quot;html&quot;/&gt;
 *                		&lt;xsl:template match=&quot;/root&quot;&gt;
 *                				&lt;div/&gt;
 *                		&lt;/xsl:template&gt;
 *                &lt;/xsl:stylesheet&gt;';
 *    </pre></code>
 * <ul>
 * <li> Loading an XML string into DOM and converting DOM back to XML string<br/>
 *
 *    @example <code><pre>
 *    var dom = JSXML.fromString(xml),
 *        child = dom.createElement('child');
 *    child.setAttribute('foo', 'bar');
 *    dom.documentElement.appendChild(child);
 *    alert(JSXML.stringify(dom));
 *    </pre></code>
 *
 * </li>
 *
 * <li> Loading anything into DOM and doing something with it<br/>
 *
 *    @example <code><pre>
 *    JSXML.fromFile('xml.xml', function(dom){
 *        var child = dom.createElement('child');
 *        child.setAttribute('foo', 'bar');
 *        dom.documentElement.appendChild(child);
 *        alert(JSXML.stringify(dom));
 *    });
 *    // OR
 *    JSXML.load(source, function(dom){
 *        // doing something here
 *    });
 *    </pre></code>
 *
 * </li>
 *
 * <li> Transforming an XML with an XSLT<br/>
 *
 *    @example <code><pre>
 *    var resultString = JSXML.transReady(xml, xsl);
 *    // OR
 *    JSXML.trans(xmlSource, xslSource, function(resultString){
 *        // doing something here
 *    });
 *    </pre></code>
 *
 * </li>
 * </ul>
 *
 * @cfg {Object} [context=window] The host object to hold the JSXML object;
 * @cfg {String} [name='JSXML'] Key to access the JSXML object;
 * @cfg {Boolean} [file_cache=true] — whether to cache DOM objects from retrieved XML files and use them next time the same file is called;
 * @cfg {'alert'|'throw'|'ignore'} [errors='alert'] How to behave in case an error occurred (broken XML, invalid XSLT etc.). <ul>
 *   <li/><b>alert</b> alert the user
 *   <li/><b>throw</b> excetion
 *   <li/><b>ignore</b> silent
 * </ul>
 * @cfg {String} [encoding='UTF-8'] кодировка для XML
 */
(function(cfg){
	var defaults = {
		context: window,
		name: 'JSXML',
		file_cache: true,
		errors: 'throw', // throw, ignore
		encoding: 'UTF-8'
	};
	if (!cfg) cfg = {};
	for (var i in defaults)
		cfg[i] = (cfg[i] || defaults[i]);


	// conveyor is used to build and execute callback chains
	var conveyor = function(cb){
		if (cb) this.cb = cb;
		this.tasks = [];
	};
	conveyor.prototype.add = function(task){
		this.tasks.push(task);
	};
	conveyor.prototype.exe = function(i){
		if (typeof(i) == 'function') {
			this.cb = i;
			i = 0;
		}
		i = i ? i : 0;
		var $this = this;
		if (this.tasks.length > i) this.tasks[i](function(){
			$this.exe(i+1);
		}); else if (typeof(this.cb) == 'function') this.cb();
	};


	//region PROTECTED functions n properties
	/**
	 * Exception handler
	 * @param {String} msg message
	 * @param {Error} e Error object
	 * @private
	 */
	function _throw(msg,e){
		if(!e){
			e = {
				message: msg
				,file:'jsxml.js'
				,'function': cfg.name
			};
		}
		ERROR.add(e)
		switch (cfg.errors) {
			case 'alert':
					if(msg) alert(cfg.name + ":\r\n" + msg)
					else ERROR.show(e)
				break;
			case 'throw':
					if(msg) throw new Error(cfg.name + ":\r\n" + msg)
					else throw e
				break;
			case 'ignore':
				break;
		}
	}

	/**
	 * Вытаскивает корневой узел
	 * @param names
	 * @returns {*}
	 * @private
	 */
	function _borrowRootName(names){
		return names ? ( isArray(names) ? names.shift() : names ) : 'root';
	}

	var _ajax= null;

	/**
	 * клонирует источник
	 * @param {Array|Object} o source for clone
	 * @returns {Array|Object}
	 * @private
	 */
	function _copy(o){
		if (typeof o != 'object' || o === null) return o;
		var r = clone((isArray(o)? [] : {}) ,o);
		return r;
	}
	//endregion
	
	
	var lib = function(){
		//region PRIVATE methods n properties
		//...
		//endregion

		Constructor.call(this)
	};
	lib.prototype = {
		/**
		 * Ajax запрос формирует
		 * @param {Object} cfg конфиг запроса
		 * @todo: вынести в **private|protected**
		 */
		ajax: function(cfg){
			if (_ajax === null) {
				if (window.jQuery) {
					_ajax = jQuery.ajax;
				} else if (window.Ext && window.Ext.Ajax) { // ExtJS
					_ajax = function(cfg){
						Ext.Ajax.request({
							url: cfg.url,
							success: function(x){
								cfg.success(x.responseXML);
							},
							failure: cfg.error
						});
					};
				} else if (window.Ajax && Ajax.Request) { // Prototype
					_ajax = function(cfg){
						new Ajax.Request(cfg.url, {
							method:'get',
							onSuccess: function(x){
								cfg.success(x.responseXML);
							},
							onFailure: cfg.error,
							onException: function(r, e) {
								cfg.error(e);
							}
						});
					};
				} else if (window.YAHOO) { // YAHOO
					_ajax = function(cfg){
						YAHOO.util.Connect.asyncRequest('GET', cfg.url, {
							success: function(x){
								cfg.success(x.responseXML);
							},
							failure: cfg.error
						});
					};
				} else {
					_ajax = false;
				}
			} else if(window.Ajax) {
				_ajax = function(cfg){
					Ajax.request({
						url: cfg.url,
						success: function(x){
							cfg.success(x.responseXML);
						},
						failure: cfg.error
					});
				};
			}
			if (_ajax) {
				try {
					_ajax(cfg);
				} catch (e) {
					cfg.error(e);
				}
			} else _throw(this.lng.noajax);
		},

		/**
		 * The following two pieces of code are [taken from](http://www.alistapart.com/articles/crossbrowserscripting)
		 * @const nodeTypes
		 * @property {Object} nodeTypes
		 * @static
		 * @member JSXML
		 */
		nodeTypes: {
			ELEMENT_NODE: 1,
			ATTRIBUTE_NODE: 2,
			TEXT_NODE: 3,
			CDATA_SECTION_NODE: 4,
			ENTITY_REFERENCE_NODE: 5,
			ENTITY_NODE: 6,
			PROCESSING_INSTRUCTION_NODE: 7,
			COMMENT_NODE: 8,
			DOCUMENT_NODE: 9,
			DOCUMENT_TYPE_NODE: 10,
			DOCUMENT_FRAGMENT_NODE: 11,
			NOTATION_NODE: 12
		},

		/**
		 * Import Node
		 * @param document
		 * @param node
		 * @param {Boolean} allChildren recursively get all of the child nodes
		 * @returns {Element|Text}
		 * @method importNode
		 * @member JSXML
		 */
		importNode: function(document, node, allChildren) {
			var result;
			/* find the node type to import */
			switch (node.nodeType) {
				case this.nodeTypes.ELEMENT_NODE:
					/* create a new element */
					var newNode = document.createElement(node.nodeName);
					/* does the node have any attributes to add? */
					if (node.attributes && node.attributes.length > 0)
					/* add all of the attributes */
						for (var i = 0, il = node.attributes.length; i < il;)
							newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i++].nodeName));
					/* are we going after children too, and does the node have any? */
					if (allChildren && node.childNodes && node.childNodes.length > 0)
					/* recursively get all of the child nodes */
						for (var i = 0, il = node.childNodes.length; i < il;)
							newNode.appendChild(this.importNode(document, node.childNodes[i++], allChildren));
					result = newNode;
					break;
				case this.nodeTypes.TEXT_NODE:
				case this.nodeTypes.CDATA_SECTION_NODE:
				case this.nodeTypes.COMMENT_NODE:
					result = document.createTextNode(node.nodeValue);
					break;
			}
			return result
		},

		/**
		 * создает XML-документ
		 * @param [node]
		 * @returns {XMLDocument}
		 */
		newDoc: function(node){
			var self = this;

			function _createElement(){
				var res;
				var xml = document.createElement('xml');
				xml.src = self._xmlHeader;
				document.body.appendChild(xml);
				res = xml.XMLDocument;
				document.body.removeChild(xml);
				return res
			}
			function _createActiveXObject(){
				var progIDs = [
					"Msxml2.FreeThreadedDOMDocument.3.0",
					"Msxml2.FreeThreadedDOMDocument",
					"Microsoft.XMLDOM",
					"Msxml2.DOMDocument.6.0",
					"Msxml2.DOMDocument.5.0",
					"Msxml2.DOMDocument.4.0",
					"Msxml2.DOMDocument.3.0",
					"MSXML2.DOMDocument",
					"MSXML.DOMDocument"
				]
				for (var i = 0; i < progIDs.length; i++) {
					try {
						return new ActiveXObject(progIDs[i]);
					} catch(e) {}
				}
				return null
			}

			var d=null;
			// create IE xml DOM without ActiveX, submitted by alfalabs.net@gmail.com
			try{
				if(typeof(ActiveXObject)!='undefined' || ActiveXObject instanceof Object){
					d = _createActiveXObject();
					if(d){
						d.async = false;
						while(d.readyState != 4) {}
					}else d= _createElement();
				}else{
					d= _createElement();
				}
			}catch(e){ _throw(null,e) }
			if(!d){
				try{
					d= _createElement();
				}catch(e){ _throw(null,e) }
			}
			if(!d){
				try{
					d = document.implementation.createDocument("", node && !node.tagName ? node : 'test', null);
				}catch(e){ _throw(null,e) }
			}
			if(!d){
				try {
					d = new DOMParser();
					//TODO: d = d.parseFromString('','text/xml');
					// text/xml
					// application/xml
					// application/xhtml+xml
					// image/svg+xml
				}catch(e){ _throw(null,e) }
			}
			if(!d){
				_throw(this.lng.broken);
				return null
			}

			if(node){
				try{
					if (typeof(ActiveXObject)!='undefined' || ActiveXObject instanceof Object) {
						if (node.tagName) {
							d.appendChild(this.importNode(d, node, true));
						} else {
							d.appendChild(d.createElement(node));
						}
					} else {
						if (node.tagName) {
							d.replaceChild(d.importNode(node, true), d.documentElement);
						}
					}
				}catch(e){ _throw(null,e) }
			}
			return d;
		}

		/**
		 * клонирует XML
		 * @param obj
		 * @returns {XMLDocument}
		 */
		,copy: function(obj){
			return this.fromString(this.stringify(obj));
		}

		/**
		 * создает XMLDocument из строки ИЛИ объекта (XMLDocument)
		 * @param src
		 * @method fromStringOrObject
		 * @member JSXML
		 * @returns {XMLDocument}
		 */
		,fromStringOrObject: function(src) {
			return this.fromObject(src) || this.fromString(src);
		}
		/**
		 * создает XMLDocument из строки
		 * @param {String} str строка содержащая тело XML
		 * @param {Boolean} [checkXmlDeclaration=true] проверять Xml декларацию?
		 * @param {String} [type='text/xml'] тип документа <ul>
		 *   <li/>text/xml
		 *   <li/>application/xml
		 *   <li/>application/xhtml+xml
		 *   <li/>image/svg+xml
		 * </ul>
		 * @method fromString
		 * @member JSXML
		 * @returns {XMLDocument}
		 */
		,fromString: function(str, checkXmlDeclaration,type) {
			//TODO: добавить создание всего xml в теле как в newDoc <test> по _createElement()
			type = type || 'text/xml';
			if (typeof(str) != 'string') return null;
			checkXmlDeclaration = (checkXmlDeclaration !== false);
			var o = null;
			if (checkXmlDeclaration && !/^<\?xml/.test(str)) return null;
			if(window.DOMParser){
				o = new DOMParser();
			}else
				o = this.newDoc();
			if(!o){
				_throw(this.lng.broken);
				return null
			}
			if('loadXML' in o){
				o.loadXML(str);
				if (!o.documentElement || (o.parseError && o.parseError.errorCode != 0)) {
					e={
						message : (o.parseError.reason +"\r\n"+ o.parseError.linepos)
						,userMsg : this.lng.broken
						,line : o.parseError.line
						,'function' : 'fromString->loadXML'
						,file : 'jsxml.js'
					};
					_throw(this.lng.broken +"\r\n"+ o.parseError.reason, e);
					return null;
				}
			}else if('load' in o){
				o.load(str);
			}else if( o instanceof DOMParser && 'parseFromString' in o && typeof str == 'string'){
				o = o.parseFromString(str, type);
				var e = (o.getElementsByTagName('parsererror') || o.documentElement.tagName=="parsererror");
				if (e.length > 0) {
					_throw(this.lng.broken +"\r\n"+ o.documentElement.textContent);
					return null;
				}
			}
			return o;
		}
		/**
		 * создает XMLDocument из Node
		 * @param {Node} el Node для создания XML
		 * @method fromString
		 * @member JSXML
		 * @returns {XMLDocument}
		 */
		,fromObject : function(el) {
			if(!el.documentElement){
				if(el.tagName){
					return this.newDoc(el);
				}
				return null;
			}
			return el;
		}
		/**
		 * загрузка XML из файла (or Ajax)
		 * @method fromFile
		 * @param {String} file Имя и путь к файлу XML
		 * @param callback
		 * @param [scope]
		 * @member JSXML
		 */
		,fromFile: function(file, callback, scope) {
			var cl = this._cache_loading,
					c = this._cache,
					$this = this;
			if (cl[file]) { // i.e. the same file is currently loading
				if (cl[file] === true) cl[file] = new conveyor;
				cl[file].add(function(cb){
					callback.call(scope ? scope : c[file], c[file]);
					cb();
				});
			} else if (c[file]) {
				callback.call(scope ? scope : c[file], c[file]);
			} else {
				cl[file] = true;
				this.ajax({
					url: file,
					success: function(xml){
						if (!xml.documentElement) {
							_throw($this.lng.brokenfile + ': ' + file);
							return;
						}
						c[file] = xml;
						callback.call(scope ? scope : xml, xml);
						if (typeof(cl[file]) == 'object') cl[file].exe();
						if (cl[file]) delete cl[file];
					},
					error: function(e){
						cl[file] = false;
						if (e) {
							var m = [];
							m.push($this.lng.exception + ":\r\n" + file);
							if (e.name) m.push(e.name);
							if (e.message) m.push(e.message);
							_throw(m.join("\r\n"));
						} else _throw($this.lng.brokenfile + ': ' + file);
					}
				})
			}
		}
		/**
		 * загрузка XML с сервера или из переданной строки или из переданного XMLDocument
		 * @method load
		 * @param {String} source строка XML или XMLDocument (XML-object) или URL-адрес откуда подгружать XML
		 * @param {Function} callback
		 * @param [scope]
		 * @member JSXML
		 */
		,load: function(source, callback, scope) {
			var o = this.fromStringOrObject(source);
			if (o) callback.call(scope ? scope : o, o);
			else this.fromFile(source, callback, scope);
		}

		/**
		 * XML to String
		 * @param source
		 * @param {Boolean} [xmlHeaderNeeded=true] показывать заголовок xml
		 * @param {boolean} [sanity=false] exec sanitization (html entities)
		 * @method stringify
		 * @member JSXML
		 * @returns {String}
		 */
		,stringify: function(source, xmlHeaderNeeded ,sanity){
			xmlHeaderNeeded = !(xmlHeaderNeeded === false);

			var xml = typeof(source) == 'string'
							? source
							: (
										source.xml
												? source.xml
												: (
														typeof(GetXmlStringFromXmlDoc) != 'undefined'
																? GetXmlStringFromXmlDoc(source)
																: new XMLSerializer().serializeToString(source))),
					xmlHeaderPresent = /^<\?xml/.test(xml);
			if (xml.indexOf("<transformiix:result") > -1) {
				// extract contents of transform iix node if it is present
				xml = xml.substring(xml.indexOf(">") + 1, xml.lastIndexOf("<"));
			}
			if (xmlHeaderNeeded && /="UTF\-16"\?/.test(xml)) xml = xml.replace(/="UTF\-16"\?/, '="{0}"?'.format(cfg.encoding));
			if (xmlHeaderNeeded && !xmlHeaderPresent) xml = this._xmlHeader+'\r\n' + xml;
			if (!xmlHeaderNeeded && xmlHeaderPresent) xml = xml.replace(/^<\?xml[^<]+/, '');
			if(sanity){ xml = htmlentities(xml); }
			return xml;
		}
		/**
		 * Object or Array transform to DOM
		 * @param o
		 * @param names
		 * @param parentNode
		 * @returns {Node}
		 */
		,toDom: function(o, names, parentNode){
			var rootName = _borrowRootName(names);
			if (parentNode) parentNode = parentNode.appendChild(parentNode.ownerDocument.createElement(rootName));
			else parentNode = this.newDoc(rootName).documentElement;
			var t;
			if (isArray(o)) {
				for (var i = 0; i < o.length; i++ )
					this.toDom(o[i], _copy(names), parentNode);
			} else {
				for (var i in o) {
					t = typeof o[i];
					switch (t) {
						case 'string':
						case 'number':
						case 'boolean':
							try {
								var v = t == 'boolean' ? (o[i]?1:0) : o[i];
								parentNode.setAttribute(i, String(v));
							} catch(e) {
								_throw(String.format(this.lng['Unable to set attribute named "{0}"; {1}'] ,i ,e.message));
							}
							break;
						case 'object':
							if (o[i] !== null)
								this.toDom(o[i], isArray(names) ? [i].concat(names) : i, parentNode);
							break;
						default:
							_throw(String.format(this.lng.unsuitableType, i ,t));
							return false;
							break;
					}
				}
			}
			return parentNode.ownerDocument.documentElement == parentNode ? parentNode.ownerDocument : parentNode;
		}

		/**
		 * transform remote XML after load on client<br/>
		 * This is first step transformation. Second step auto execute after load XML.
		 * @param xmlSrc
		 * @param xslSrc
		 * @param callback
		 * @param nativeResult
		 * @param doc
		 * @member JSXML
		 */
		,trans: function(xmlSrc, xslSrc, callback, nativeResult, doc){
			var $this = this;
			this.load(xmlSrc, function(xml){
				$this._trans2(xml, xslSrc, callback, nativeResult, doc);
			});
		}
		/**
		 * transform XML from string\Object (without load from server)
		 * @param xmlSrc
		 * @param xslSrc
		 * @param nativeResult
		 * @param doc
		 * @returns {String|Node}
		 * @member JSXML
		 */
		,transReady: function(xmlSrc, xslSrc, nativeResult, doc) {
			var xmlSrc = this.fromStringOrObject(xmlSrc),
					_xslSrc = typeof xslSrc == 'string'? xslSrc : this.stringify(xslSrc),
					xslSrc = this.fromStringOrObject(xslSrc),
					r;
			if (!xmlSrc || !xslSrc) return false;

			try {
				// 1. Use type XSLTProcessor, if browser (FF, Safari, Chrome etc) supports it
				if (typeof (XSLTProcessor) != "undefined"
						&& document.implementation && document.implementation.createDocument) {
					var processor = new XSLTProcessor();
					processor.importStylesheet(xslSrc);
					r = doc
							? processor.transformToDocument(xmlSrc)
							: processor.transformToFragment(xmlSrc, document);
				} else
				// 2. Use function [transformNode] on the XmlDocument, if browser (IE6, IE7, IE8) supports it
				if (typeof (xmlSrc.transformNode) != "undefined") {
					r = xmlSrc.transformNode(xslSrc);
					r = this.fromStringOrObject(r) || r;
				} else
				// 3. Use function transform on the XsltProcessor used for IE9 (which doesn't support [transformNode] any more)
				if (typeof(ActiveXObject) != 'undefined' || ActiveXObject instanceof Object) {
					var xslt = new ActiveXObject("Msxml2.XSLTemplate");
					var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
					xslDoc.loadXML(_xslSrc);
					xslt.stylesheet = xslDoc;
					var xslProc = xslt.createProcessor();
					xslProc.input = xmlSrc;
					xslProc.transform();
					r = xslProc.output;
				}
			} catch (e) {
				_throw(this.lng.brokenxslt);
				return false;
			}
			return (nativeResult || !r) ? r : this.stringify(r, false);
		}
		/**
		 *
		 * @param config
		 * @returns {string[]}
		 * @member JSXML
		 */
		,getXslWrap: function(config){
			config = config || {};

			return [
				(this._xmlHeader
						+'<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output encoding="'
						+ cfg.encoding
						+'" indent="'
						+ (config.indent || 'yes')
						+ '" method="'
						+ (config.method || 'html')
						+ '" />'),
				'</xsl:stylesheet>'
			];
		}

		/**
		 * second step transformation -> load XSLT n execute transform XML
		 * @param xml
		 * @param xslSrc
		 * @param callback
		 * @param nativeResult
		 * @param doc
		 * @private
		 * @member JSXML
		 */
		,_trans2: function(xml, xslSrc, callback, nativeResult, doc){
			this.load(xslSrc, function(xsl){
				var scope;
				if (callback && typeof callback.length == "number" && typeof callback.splice == "function") {
					scope = callback[1];
					callback = callback[0];
				} else scope = callback;
				callback.call(scope, this.transReady(xml, xsl, nativeResult, doc));
			}, this);
		},


		/**
		 * @property {Object} lng сообщения/тексты, которые могут быть переведены под конкретный язык
		 */
		lng: {
			broken: 'Broken XML string'
			,brokenfile: 'Broken XML file'
			,brokenxslt: 'Broken XSLT'
			,noajax: 'No AJAX library found. See docs for supported libraries.'
			,exception: 'An exception happened while trying to load url'
			,unsuitableType : 'Unsuitable type of index "{0}" for converting to XML: {1}'
			,'Unable to set attribute named "{0}"; {1}': 'Unable to set attribute named "{0}"; {1}'
		}

		/**
		 * @property {String} _xmlHeader XML Header with encoding
		 * @private
		 */
		,_xmlHeader : '<?xml version="1.0" encoding="{0}"?>'.format(cfg.encoding)
		,_cache : {}
		,_cache_loading : {}

		/**
		 * @static
		 * @member JSXML
		 */
		,version : '0.4.1'
		/**
		 * @static
		 * @member JSXML
		 * @property {{major : number,minor : number,patch : number}} versionDetail
		 */
		,versionDetail : {
			major : 0
			,minor : 4
			,patch : 1
		}
	};


	// for (var i in pro) lib.prototype[i] = pro[i];
	cfg.context[cfg.name] = new lib();
})();