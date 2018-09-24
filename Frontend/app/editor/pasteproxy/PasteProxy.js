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
			'FBEditor.editor.pasteproxy.FileProxy',
			'FBEditor.editor.pasteproxy.ModelProxy',
		    'FBEditor.resource.data.PasteData'
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
		 * @private
		 * @property {String} Вставляемый фрагмент в виде html.
		 */
		html: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.FileProxy} Прокси для вставки изображения.
		 */
		fileProxy: false,

		/**
		 * @private
		 * @property {FBEditor.util.ClipboardData} Синглтон для работы с буфером.
		 */
		clipboardData: null,

		/**
		 * @param {Object} data
		 * @param {Object} data.e Объект события вставки.
		 * @param {Object} data.manager Менеджер редактора.
		 */
		constructor: function (data)
		{
			var me = this,
				evt = data.e,
				html = data.html,
				items = evt.clipboardData.items,
				manager = FBEditor.resource.Manager,
				resourcesPaste = manager.getPaste();

			me.manager = data.manager;

			// объект для работы с буфером
			me.clipboardData = Ext.create('FBEditor.util.ClipboardData', evt);

			if (items.length === 1 && items[0] && items[0].kind === 'file')
			{
				// создаем модель изображения
				me.createModelFromFile(items[0].getAsFile());
			}
			else
			{
				if (!html)
				{
					// получаем html из буфера обмена
					html = me.clipboardData.getHtml();

					if (!html)
					{
						// получаем обычный текст из буфера обмена
						html = me.clipboardData.getText();

						// преобразуем обычный текст к html
						html = me.convertTextToHtml(html);
					}
					else
					{
						// удаляем все символы перевода строк и табуляции
						html = html.replace(/\n+|\t+/g, ' ');
					}
				}

				//console.log(html);

				// создаем модель элемента из DOM
				me.createModel(html);

				me.html = html;
			}

			// сохраняем вставляемые ресурсы в редакторе
			resourcesPaste.save();
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
		 * Возвращает модель элемента вновь созданную из html или ресурса.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getCreateModel: function ()
		{
			var me = this,
				manager = FBEditor.resource.Manager,
				resourcesPaste = manager.getPaste(),
				model;

			model = me.html ? me.createModel(me.html) : me.createModelFromFile();

			// сохраняем вставляемые ресурсы в редакторе
			resourcesPaste.save();

			return model;
		},

		/**
		 * Возвращает данные изобржаения, полученные из буфера RTF.
		 * @param {String} src Путь изображения.
		 * @return {Object} Данные изображения.
		 */
		getImageFromRtf: function (src)
		{
			var me = this,
				cbData = me.clipboardData,
				data = null,
				images;

			// получаем данные изображений из RTF
			images = cbData.getImagesFromRtf();

			if (images)
			{
				Ext.each(
					images,
					function (item)
					{
						if (item.src === src)
						{
							data = item;
							return false;
						}
					}
				);
			}
			
			return data;
		},

		/**
		 * @private
		 * Создает модель изображение из данных файла.
		 * @param {File} file Файл
		 * @return {FBEditor.editor.element.AbstractElement} Модель.
		 */
		createModelFromFile: function (file)
		{
			var me = this,
				fileProxy = me.fileProxy,
				model;

			console.log('ВСТАВКА ИЗОБРАЖЕНИЯ', file);

			// создаем прокси-объект для работы с файлом
			fileProxy = fileProxy || Ext.create('FBEditor.editor.pasteproxy.FileProxy', {file: file, pasteProxy: me});

			// получаем элемент
			model = fileProxy.getModel();

			if (!model)
			{
				return false;
			}

			console.log(model.getXml());

			me.model = model;
			me.fileProxy = fileProxy;

			return model;
		},

		/**
		 * @private
		 * Создает модель элемента из строки html.
		 * @param {String} html
		 * @return {FBEditor.editor.element.AbstractElement} Модель.
		 */
		createModel: function (html)
		{
			var me = this,
				parser = new DOMParser(),
				dom,
				domProxy,
				modelProxy,
				el,
				model;
			
			// получаем DOM для вставляемого html
			dom = parser.parseFromString(html, 'text/html');

			console.log('--- [1] ВСТАВКА: ИСХОДНЫЙ HTML ---');
			console.log(dom);

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

			return el;
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