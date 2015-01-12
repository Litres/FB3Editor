/**
 * Абстрактный контейнер для полей формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.AbstractFieldContainer',
	{
		extend: 'Ext.form.FieldContainer',
		requires: [
			'FBEditor.view.form.desc.AbstractFieldController'
		],
		xtype: 'desc-fieldcontainer',
		controller: 'form.desc.abstractField',
		listeners: {
			resetFields: 'onResetFields',
			loadData: 'onLoadData'
		},

		afterRender: function ()
		{
			var me = this,
				plugin;

			plugin = me.getPlugin('fieldcontainerreplicator');
			if (plugin)
			{
				me.name = 'plugin-fieldcontainerreplicator';
			}
			me.callParent(arguments);
		},

		/**
		 * Возвращает новые данные формы.
		 * @param {Object} d Старые данные формы.
		 * @return {Object} Данные формы, к которым добавились данные из полей текущего компонента.
		 */
		getValues: function (d)
		{
			var me = this,
				items = me.items,
				data = d;

			items.each(
				function (item)
				{
					if (item.getValues)
					{
						data = item.getValues(data);
					}
				}
			);

			return data;
		},

		/**
		 * Перебирает объект данных и удаляет пустые значения.
		 * @param {Object} values Данные.
		 * @return {Object} Данные без пустых значений.
		 */
		removeEmptyValues: function (values)
		{
			var data = null;

			Ext.Object.each(
				values,
				function (key, item)
				{
					if (item)
					{
						data = data || {};
						data[key] = item;
					}
				}
			);

			return data;
		}
	}
);