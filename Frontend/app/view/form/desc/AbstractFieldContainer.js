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
			loadData: 'onLoadData',
			editable: 'onEditable'
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
		 * Очищает стили и сообщения об ошибках заполнения полей.
		 */
		clearInvalid: function ()
		{
			var me = this,
				items = me.items;

			items.each(
				function (item)
				{
					if (item.clearInvalid)
					{
						item.clearInvalid();
					}
				}
			);
		},

		/**
		 * Проверяет валидность полей.
		 * @return {Boolean} Валидны ли поля.
		 */
		isValid: function ()
		{
			var me = this,
				items = me.items,
				isValid = true;

			if (me.prefixName)
			{
				isValid = me.getValid(me.prefixName);
			}
			else
			{
				items.each(
					function (item)
					{
						if (item.isValid && !item.isValid())
						{
							isValid = false;
						}
					}
				);
			}

			return isValid;
		},

		/**
		 * Возвращает валидность полей опрделенного контейнера.
		 * @property {String} Имя контейнера.
		 * @return {Boolean} Валидны ли поля.
		 */
		getValid: function (name)
		{
			var me = this,
				items = me.items,
				values = me.getValues({}),
				isValid = true;

			values = values[name] ? true : false;
			items.each(
				function (item)
				{
					if (item.isValid && !item.isValid() && values)
					{
						isValid = false;
					}
					if (!values && item.clearInvalid)
					{
						item.clearInvalid();
					}
				}
			);

			return isValid;
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
					if (!Ext.isEmpty(item))
					{
						data = data || {};
						data[key] = item;
					}
				}
			);

			return data;
		},

		/**
		 * Возвращает данные полей.
		 * @param {Ext.form.Field[]} fields Поля.
		 * @return {Array} Данные.
		 */
		getDataFields: function (fields)
		{
			var me = this,
				data = null;

			Ext.Object.each(
				fields,
				function (key, item)
				{
					var val = item.getValue();

					if (val)
					{
						data = data || [];
						data.push(val);
					}
				}
			);

			return data;
		},

		/**
		 * Обновляет данные полей в контейнере.
		 * @param {Object} data Данные.
		 */
		updateData: function (data)
		{
			var me = this;

			Ext.Object.each(
				data,
				function (name, value)
				{
					var field = me.down('[name=' + name + ']');
					//console.log('field', field, name, value);

					if (field)
					{
						if (Ext.isObject(value))
						{
							field.updateData(value);
						}
						else
						{
							field.setValue(value);
						}
					}
				}
			);
		}
	}
);