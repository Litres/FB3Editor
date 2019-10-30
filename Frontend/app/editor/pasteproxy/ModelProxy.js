/**
 * Прокси модели, получаемой из вставляемого фрагмента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.ModelProxy',
	{
		requires: [
			'FBEditor.editor.pasteproxy.model.ElementProxy',
			'FBEditor.editor.pasteproxy.model.ImgProxy',
			'FBEditor.editor.pasteproxy.model.StyleProxy',
			'FBEditor.editor.pasteproxy.model.TextProxy',
			'FBEditor.editor.pasteproxy.google.doc.model.Proxy',
			'FBEditor.editor.pasteproxy.office.word.model.Proxy',
			'FBEditor.editor.pasteproxy.ModelProxyDefault'
		],

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.ModelProxyDefault} Прокси модели.
		 */
		modelProxy: null,

		/**
		 * @param data {Object}
		 * @param {FBEditor.editor.element.AbstractElement} data.el Вставляемый элемент.
		 * @param {FBEditor.editor.pasteproxy.PasteProxy} data.pasteProxy Прокси данных.
		 */
		constructor: function (data)
		{
			var me = this,
				el = data.el,
				pasteProxy = data.pasteProxy,
				pasteType = pasteProxy.getType(),
				modelCls;

			// создаем конкретную модель вставки в зависимости от типа
			
			switch (pasteType)
			{
				case pasteProxy.GOOGLE_TYPE:
					modelCls = 'FBEditor.editor.pasteproxy.google.doc.model.Proxy';
					break;
				
				case pasteProxy.WORD_OFFICE_TYPE:
					modelCls = 'FBEditor.editor.pasteproxy.office.word.model.Proxy';
					break;
				
				default:
					modelCls = 'FBEditor.editor.pasteproxy.ModelProxyDefault';
			}
			
			me.modelProxy = Ext.create(modelCls, {el: el, pasteProxy: pasteProxy});
		},

		/**
		 * Возвращает модель, полученную путем преобразования вставляемого елемента.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getModel: function ()
		{
			var me = this,
				el;

			// нормализуем элементы
			el = me.modelProxy.normalizeElement();
			
			return el;
		}
	}
);