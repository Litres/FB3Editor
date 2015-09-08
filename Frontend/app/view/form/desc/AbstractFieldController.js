/**
 * Абстрактный контроллер контейнера для полей формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.AbstractFieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.abstractField',

		/**
		 * Загружает данные в поля.
		 * @param {Object} data Данные, полученные из книги.
		 */
		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView(),
				nextContainer,
				plugin;

			//console.log('>>>>>>', view.name, view.id, view, data);
			plugin = me.getPluginContainerReplicator(view);
			nextContainer = plugin.getCmp();
			Ext.Object.each(
				data,
			    function (index, obj)
			    {
				    Ext.Object.each(
					    obj,
				        function (name, value)
				        {
					        var field = nextContainer.query('[name=' + name + ']')[0];
					        //console.log('field', field, name, value);

					        if (field)
					        {
						        if (Ext.isObject(value))
						        {
							        field.fireEvent('loadData', value);
						        }
						        else
						        {
							        field.setValue(value);
						        }
					        }
				        }
				    );
				    if (data[parseInt(index) + 1])
				    {
					    plugin.addFields();
					    nextContainer = nextContainer.nextSibling();
					    plugin = nextContainer.getPlugin('fieldcontainerreplicator');
				    }
			    }
			);
		},

		/**
		 * Активирует поисковый контейнер.
		 */
		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				btn;

			btn = view.down('[cls=form-desc-customBtn]');

			if (btn)
			{
				btn.switchContainers(true);
			}
		},

		/**
		 * Устанавливает редактируемость полей.
		 * @param {Boolean} editable Редактируемые ли поля.
		 */
		onEditable: function (editable)
		{
			var me = this,
				view = me.getView(),
				fields,
				plugin,
				radios;

			plugin = view.down('form-desc-title-alt').getPlugin('fieldcontainerreplicator');
			if (plugin)
			{
				if (editable)
				{
					// разрешаем добавлять новые поля через плагин
					plugin.getBtnAdd().enable();
				}
				else
				{
					// запрещаем добавлять новые поля через плагин
					plugin.getBtnAdd().disable();
				}
			}

			/*radios = view.down('radiogroup');
			if (radios)
			{
				if (editable)
				{
					radios.enable();
				}
				else
				{
					radios.disable();
				}
			}*/

			fields = view.query('[name]');
			Ext.Array.each(
				fields,
			    function (item)
			    {
				    if (item.setEditable)
				    {
					    item.setEditable(editable);
				    }
			    }
			);
		},

		/**
		 * Сбрасывает поля формы.
		 */
		onResetFields: function ()
		{
			var me = this;

			me.resetContainer();
		},

		/**
		 * @private
		 * Удаляет все клонированные поля.
		 */
		resetContainer: function ()
		{
			var me = this,
				view = me.getView(),
				containers,
				childContainers,
				fields,
				field;

			// удаляем клонированные поля с плагином fieldcontainerreplicator
			containers = me.getContainersReplicator(view);
			Ext.each(
				containers,
				function (item, index)
				{
					if (index)
					{
						// удаляем все поля кроме первого контенейра
						view.remove(item);
					}
					else
					{
						// уведомляем первый контейнер
						item.fireEvent('resetContainer');

						// удаляем вложенные контейнеры первого контенейра
						childContainers = me.getContainersReplicator(item);
						Ext.each(
							childContainers,
							function (itemContainer)
							{
								item.remove(itemContainer);
							}
						);

						// делаем неактивной кнопку удалить
						item.getPlugin('fieldcontainerreplicator').getBtnRemove().disable();
					}
				}
			);

			// удаляем клонированные поля с плагином fieldreplicator
			fields = document.querySelectorAll('#' + view.getId() + ' .plugin-fieldreplicator');
			Ext.each(
				fields,
				function (item, index)
				{
					if (index)
					{
						field = view.queryById(item.id);
						view.remove(field);
					}
				}
			);
		},

		/**
		 * @private
		 * Возвращает дочерние контейнеры с плагином fieldcontainerreplicator.
		 * @param {FBEditor.view.form.desc.AbstractFieldContainer} Родительский контейнер.
		 * @return {FBEditor.view.form.desc.AbstractFieldContainer[]} Дочерние контейнеры.
		 */
		getContainersReplicator: function (container)
		{
			return container.query('[name=plugin-fieldcontainerreplicator]');
		},

		/**
		 * @private
		 * Возвращает плагин контейнера fieldcontainerreplicator.
		 * @param {FBEditor.view.form.desc.AbstractFieldContainer} Контейнер.
		 * @return {FBEditor.ux.FieldContainerReplicator} Плагин fieldcontainerreplicator.
		 */
		getPluginContainerReplicator: function (container)
		{
			var me = this,
				plugin;

			plugin = me.getContainersReplicator(container).length ?
			            me.getContainersReplicator(container)[0].getPlugin('fieldcontainerreplicator') :
						null;

			return plugin;
		}
	}
);