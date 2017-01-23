/**
 * Прокси для данных из буфера обмена, вставляемых в редактор.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.PasteProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.DomProxy',
			'FBEditor.editor.pasteproxy.ModelProxy'
		],

		/**
		 * @protected
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		manager: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Модель элемента, полученного из вставляемого DOM.
		 */
		model: null,

		/**
		 * @param {Object} data
		 * @param {Object} data.e Объект события вставки.
		 * @param {Object} data.manager Менеджер редактора.
		 */
		constructor: function (data)
		{
			var me = this,
				evt = data.e,
				parser = new DOMParser(),
				html,
				dom;

			me.manager = data.manager;

			// получаем html из буфера обмена
			html = evt.clipboardData.getData('text/html');

			if (!html)
			{
				// получаем обычный текст из буфера обмена
				html = evt.clipboardData.getData('text');

				// преобразуем обычный текст к html
				html = me.convertTextToHtml(html);
			}
			else
			{
				// удаляем все символы перевода строк и табуляции
				html = html.replace(/\n+|\t+/g, ' ');
			}

			// получаем DOM для вставляемого html
			dom = parser.parseFromString(html, 'text/html');

			// создаем модель элемента из DOM
			me.createModel(dom);
		},

		/**
		 * Возвращает модель элемента, полученного из вставляемого DOM.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getModel: function ()
		{
			return this.model;
		},

		/**
		 * @private
		 * Создает модель элемента из DOM.
		 * @param {Node} dom
		 */
		createModel: function (dom)
		{
			var me = this,
				domProxy,
				modelProxy,
				el,
				model;

			console.log('--- [1] ВСТАВКА: ИСХОДНЫЙ HTML ---');
			console.log(dom.body.outerHTML);

			// создаем объект для работы с DOM
			domProxy = Ext.create('FBEditor.editor.pasteproxy.DomProxy', {dom: dom, pasteProxy: me});

			// получаем элемент
			el = domProxy.getElement();

			console.log('--- [2] ВСТАВКА: ПРОМЕЖУТОЧНАЯ МОДЕЛЬ ---');
			console.log(el.getXml());

			// создаем объект для работы с моделью
			modelProxy = Ext.create('FBEditor.editor.pasteproxy.ModelProxy', {el: el, pasteProxy: me});

			// получаем элемент
			model = modelProxy.getModel();

			console.log('--- [3] ВСТАВКА: ИТОГОВАЯ МОДЕЛЬ ---');
			console.log(model.getXml());
			console.log('--- КОНЕЦ ВСТАВКИ ---');

			me.model = el;
		},

		/**
		 * @private
		 * Преобразует простой текст в html строку.
		 * @param {String} text Простой текст, который может содержать переносы.
		 * @return {String} Строка html.
		 */
		convertTextToHtml: function (text)
		{
			var html;

			html = text.replace(/^(.*?)$/gim, '<p>$1</p>');

			return html;
		}
	}
);