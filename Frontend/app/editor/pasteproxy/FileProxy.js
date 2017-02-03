/**
 * Прокси для работы с вставляемым файлом (изображением).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.FileProxy',
	{
		/**
		 * @private
		 * @property {Blob} Файл.
		 */
		file: null,

		/**
		 * @private
		 * @property {FBEditor.editor.pasteproxy.PasteProxy} Прокси данных.
		 */
		pasteProxy: null,

		/**
		 * @param data {Object}
		 * @param {File} data.file Файл.
		 * @param {FBEditor.editor.pasteproxy.PasteProxy} data.pasteProxy Прокси данных.
		 */
		constructor: function (data)
		{
			var me = this;

			me.file = data.file;
			me.pasteProxy = data.pasteProxy;
		},

		/**
		 * Возвращает модель.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getModel: function ()
		{
			var me = this,
				pasteProxy = me.pasteProxy,
				manager = pasteProxy.manager,
				factory = manager.getFactory(),
				els = {},
				res;

			// создаем ресурс
			res = me.createResource();

			// создаем элемент
			els.body = factory.createElement('body');
			els.img = factory.createElement('img');
			els.body.add(els.img);

			// связываем ресурс с элементом
			res.addElement(els.img);

			return els.body;
		},

		/**
		 * Создает ресурс.
		 * @return {FBEditor.resource.Resource} Ресурс.
		 */
		createResource: function ()
		{
			var me = this,
				file = me.file,
				manager = FBEditor.resource.Manager,
				paste = manager.getPaste(),
				res,
				data;

			// создаем ресурс
			data = Ext.create('FBEditor.resource.data.PasteData', {blob: file});
			res = Ext.create('FBEditor.resource.Resource', data.getData());

			// добавляем ресурс в очередь вставщика для последующего его сохранения
			paste.add(res);

			return res;
		}
	}
);