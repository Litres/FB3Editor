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
				loader = manager.loader;

			if (resources.length)
			{
				//console.log('paste resources', resources);

				if (FBEditor.accessHub && loader.getArt())
				{
					// сохраняем ресурсы на хабе
					loader.saveResources(resources).then(
						function (xml)
						{
							// синхронизируем ресурсы с хабом
							manager.syncResources(xml);

							me.afterSave();
						}
					);
				}
				else
				{
					// загружаем в редактор
					manager.load(resources);

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
				loader = manager.loader,
				resources;

			if (history.length)
			{
				// список последних вставленных ресурсов
				resources = history.pop();

				if (FBEditor.accessHub && loader.getArt())
				{
					// удаляем ресурсы на хабе
					loader.removeResources(resources).then(
						function (xml)
						{
							// синхронизируем ресурсы с хабом
							manager.syncResources(xml);

							me.afterRemove();
						}
					);
				}
				else
				{
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