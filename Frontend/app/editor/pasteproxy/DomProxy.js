/**
 * Класс для работы с DOM, вставляемого в текст фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.DomProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.google.doc.dom.Proxy',
			'FBEditor.editor.pasteproxy.dom.SpanProxy',
			'FBEditor.editor.pasteproxy.office.word.dom.Proxy',
			'FBEditor.editor.pasteproxy.DomProxyDefault'
		],

		/**
		 * @private
		 * @property {Node} DOM.
		 */
		dom: null,

		/**
		 * @private
		 * @property {Object} CSS-классы из DOM.
		 */
		css: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.PasteProxy} Прокси данных.
		 */
		pasteProxy: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.DomProxyDefault} DOM-прокси для конкретного источника копирования.
		 */
		domProxy: null,

		/**
		 * @param data {Object}
		 * @param {Node} data.dom DOM.
		 * @param {FBEditor.editor.pasteproxy.PasteProxy} data.pasteProxy Прокси данных.
		 */
		constructor: function (data)
		{
			var me = this;
			
			me.dom = data.dom;
			me.pasteProxy = data.pasteProxy;
			
			// создаем CSS-классы из стилей DOM
			me.createCss();
			
			// создаем прокси для конкретного источника
			me.createDomProxy();
		},
		
		/**
		 * Создает DOM-прокси для конкретного источника копирования.
		 */
		createDomProxy: function ()
		{
			var me = this,
				dom = me.dom,
				css = me.css,
				pasteProxy  = me.pasteProxy,
				manager = pasteProxy.getManager(),
				body;
			
			if (body = dom.querySelector('body > b'))
			{
				// google docs
				
				pasteProxy.setType(pasteProxy.GOOGLE_TYPE);
				
				me.domProxy = Ext.create('FBEditor.editor.pasteproxy.google.doc.dom.Proxy',
					{manager: manager, body: body, css: css});
			}
			else if (dom.querySelector('head > meta[content^=Word]'))
			{
				// office word
				
				pasteProxy.setType(pasteProxy.WORD_OFFICE_TYPE);
				
				body = dom.querySelector('body');
				
				me.domProxy = Ext.create('FBEditor.editor.pasteproxy.office.word.dom.Proxy',
					{manager: manager, body: body, css: css});
			}
			else
			{
				// по умолчанию, если источник не определен
				
				body = dom.querySelector('fb3-body') || dom.querySelector('body');

				me.domProxy = Ext.create('FBEditor.editor.pasteproxy.DomProxyDefault',
					{manager: manager, body: body, css: css});
			}
		},

		/**
		 * Возвращает элемент, полученный путем преобразования DOM.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getElement: function ()
		{
			var me = this,
				//dom = me.dom,
				domProxy = me.domProxy,
				//body,
				el;

			// создаем элемент
			//body = dom.querySelector('fb3-body') || dom.querySelector('body');
			//el = me.createElement(body);
			el = domProxy.getElement();
			
			return el
		},

		/**
		 * @private
		 * Создает CSS-классы стилей из DOM.
		 */
		createCss: function ()
		{
			var me = this,
				dom = me.dom,
				styles;

			styles = dom.querySelectorAll('style');

			// парсим все классы
			Ext.Array.each(
				styles,
				function (style)
				{
					me.parseStyle(style.innerHTML);
				}
			);
		},

		/**
		 * @private
		 * Парсит текстовые классы, превращая их в объекты.
		 * @param {String} style Стили.
		 */
		parseStyle: function (style)
		{
			var me = this,
				css = me.css || {},
				nameCss,
				valCss,
				curCss,
				reg,
				res;

			// удаляем комментарии
			style = style.replace(/<!--|-->/g, '');
			style = style.replace(/[\s]{0,}\/\*(.*?)\*\/[\s]{0,}/g, '');

			// удаляем все переносы
			style = style.replace(/[\n]+/g, '');

			// выражение для получения всех классов
			reg = /[\s\n]{0,}(.*?)[\s\n]{0,}\{[\s\n]{0,}(.*?)[\s\n]{0,}\}/gm;

			while (res = reg.exec(style))
			{
				nameCss = res[1];
				valCss = res[2];

				// получаем массив свойств для класса
				valCss = valCss.split(/[\s]{0,};[\s]{0,}/);

				curCss = {};

				Ext.Array.each(
					valCss,
				    function (item)
				    {
					    var prop,
						    nameProp,
						    valProp;

					    if (item)
					    {
						    // сохраняем свойство и его значение
						    prop = item.split(/[\s]{0,}:[\s]{0,}/);
						    nameProp = prop[0];
						    valProp = prop[1];
						    curCss[nameProp] = valProp;
					    }
				    }
				);

				// добавляем класс
				css[nameCss] = css[nameCss] || [];
				css[nameCss].push(curCss);
			}

			Ext.log({level: 'info', msg: 'STYLES', dump: css});

			me.css = css;
		}
	}
);