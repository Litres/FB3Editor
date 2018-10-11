/**
 * Управляет ресурсами, вставляемыми из буфера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Paste',
	{
		/**
		 * @private
		 * @property {FBEditor.resource.Manager} Менеджер ресурсов.
		 */
		manager: null,

		/**
		 * @private
		 * @property {FBEditor.resource.Resource[]} Список ресурсов на сохранение.
		 */
		resources: [],

		/**
		 * @private
		 * @property {Array} История сохраненных списков ресурсов.
		 */
		history: [],

		/**
		 * @param {FBEditor.resource.Manager} manager Менеджер.
		 */
		constructor: function (manager)
		{
			var me = this;

			me.manager = manager;
		},

		/**
		 * Добавляет ресурс в очередь на сохранение.
		 * @param {FBEditor.resource.Resource} res Ресурс.
		 */
		add: function (res)
		{
			var me = this;

			me.resources.push(res);
		},

		/**
		 * Сбрасывает данные по вставленным ресурсам.
		 */
		reset: function ()
		{
			var me = this;

			me.history = [];
		},

		/**
		 * Сохраняет вставляемые ресурсы в редакторе.
		 */
		save: function ()
		{
			var me = this,
				resources = Ext.clone(me.resources),
				manager = me.manager,
				saveResources = [];

			if (resources.length)
			{
				//console.log('paste resources', resources);

				// проверяем вставленные ресурсы на существование
				Ext.each(
                    resources,
					function (res)
					{
						var existRes,
                            pasteEl;

                        existRes = manager.getResource(res.fileId);

						if (!existRes)
						{
							// добавляем ресурс в коллекцию на сохранение
                            saveResources.push(res);
						}
						else
						{
                            pasteEl = existRes.getPasteElement();
                            //console.log(pasteEl);

							// обновляем изображение в тексте
							existRes.updateElement(pasteEl);
						}
					}
				);

				if (saveResources.length)
				{
					// загружаем в редактор
					manager.load(saveResources);
					
					me.afterSave();
                }
			}
		},

		/**
		 * Удаляет последние вставленные ресурсы.
		 */
		remove: function ()
		{
			var me = this,
				history = me.history,
				manager = me.manager,
				resources;

			if (history.length)
			{
				// список последних вставленных ресурсов
				resources = history.pop();
				
				Ext.Array.each(
					resources,
					function (res)
					{
						// удаляем из редактора
						manager.deleteResource(res);
					}
				);
				
				me.afterRemove();
			}
		},

		/**
		 * @private
		 * Выполняется после сохранения всех ресурсов.
		 */
		afterSave: function ()
		{
			var me = this,
				resources = me.resources;

			// сохраняем вставленные ресурсы в истории
			me.history.push(resources);

			// сбрасываем текущий список
			me.resources = [];
		},

		/**
		 * @private
		 * Выполняется после удаления всех ресурсов.
		 */
		afterRemove: function ()
		{
			//
		}
	}
);