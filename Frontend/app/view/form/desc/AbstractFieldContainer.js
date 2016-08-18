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
			accessHub: 'onAccessHub',
			resetFields: 'onResetFields',
			loadData: 'onLoadData',
			loadInnerData: 'onLoadInnerData',
			editable: 'onEditable'
		},

		/**
		 * @private
		 * @property {Ext.Component} Кэширует поля, к которым уже привязано событие blur.
		 */
		fieldEventCache: [],

		afterRender: function ()
		{
			var me = this,
				plugin,
				fields;

			// поля
			fields = me.query('field');

			// регистрируем событие blur для полей
			Ext.Array.each(
				fields,
				function (item)
				{
					if (!me.fieldEventCache[item.id])
					{
						me.initEventBlur(item);
					}
				}
			);

			// плагин
			plugin = me.getPlugin('fieldcontainerreplicator');

			if (plugin)
			{
				me.name = 'plugin-fieldcontainerreplicator';
			}

			me.callParent(arguments);
		},

		onAccessHub: function ()
		{

		},

		/**
		 * Очищает стили и сообщения об ошибках заполнения полей.
		 */
		clearInvalid: function ()
		{
			var me = this,
				fields = me.query('field');

			Ext.Array.each(
				fields,
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
				isValid = true,
				isEmptyBlock = false,
				descManager = FBEditor.desc.Manager,
				fieldset,
				blockContainer,
				value,
				items;

			items = me.query('field');

			Ext.Array.each(
				items,
				function (item)
				{
					value = item.getValue();

					if (!value)
					{
						// контейнер блока полей
						blockContainer = item.up('[cls=block-container]');

						// пустые ли поля в блоке
						isEmptyBlock = blockContainer ? blockContainer.isEmptyBlock() : false;

						if (isEmptyBlock)
						{
							// убираем индикацию ошибок в пустом блоке
							blockContainer.clearInvalid();
						}
					}

					if (!isEmptyBlock && item.isValid)
					{
						if (!item.isValid())
						{
							// сохраняем ошибочный элемент
							descManager.fieldsError.push(item);

							// разворачиваем спойлер ошибочного элемента
							fieldset = item.up('desc-fieldset');
							fieldset.expand();
							fieldset = item.up('desc-fieldsetinner');

							if (fieldset)
							{
								fieldset.expand();
							}

							isValid = false;
						}
					}
				}
			);

			return isValid;
		},

		/**
		 * Возвращает валидность полей определенного контейнера.
		 * @property {String} Имя контейнера.
		 * @return {Boolean} Валидны ли поля.
		 */
		/*getValid: function (name)
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
		},*/

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
		},

		/**
		 * Все ли поля пустые в блоке.
		 * @return {Boolean}
		 */
		isEmptyBlock: function ()
		{
			var me = this,
				empty = true,
				fields;

			fields = me.query('field');

			//console.log('fields', fields);
			Ext.Array.each(
				fields,
			    function (field)
			    {
				    if (field.getValue())
				    {
					    empty = false;

					    return false;
				    }
			    }
			);

			return empty;
		},

		/**
		 * @private
		 * Регистрирует событие blur для полей.
		 * @param {Ext.Component} field
		 */
		initEventBlur: function (field)
		{
			var me = this;

			me.fieldEventCache[field.id] = true;

			field.on(
				'blur',
				function ()
				{
					var self = this,
						val = self.getValue(),
						blockContainer;

					if (!val)
					{
						// контейнер блока полей
						blockContainer = self.up('[cls=block-container]');

						if (blockContainer && blockContainer.isEmptyBlock())
						{
							blockContainer.clearInvalid();
						}
					}
				}
			);
		}
	}
);