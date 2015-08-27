/**
 * Абстрактный класс для fieldset формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.AbstractFieldset',
	{
		extend: 'Ext.form.FieldSet',
		requires: [
			'FBEditor.view.form.desc.fieldset.AbstractFieldsetController'
		],
		xtype: 'desc-fieldset',
		controller: 'desc.fieldset',
		collapsible: true,
		anchor: '100%',
		listeners: {
			resetFields: 'onResetFields',
			checkExpand: 'onCheckExpand',
			beforecollapse: function (self)
			{
				Ext.suspendLayouts();
			},
			collapse: function (self)
			{
				Ext.resumeLayouts();
			},
			beforeexpand: function (self)
			{
				Ext.suspendLayouts();
			},
			expand: function (self)
			{
				Ext.resumeLayouts();
			}
		},

		/**
		 * @property {String} Имя дочернего компонента.
		 */
		xtypeChild: '',

		/**
		 * @property {Boolean} Обязательный ли блок.
		 */
		require: false,

		/**
		 * @property {Boolean} Разворачивать ли блок автоматически, если он заполнен информацией.
		 */
		autoExpand: true,

		initComponent: function ()
		{
			var me = this,
				req = me.require,
				xtypeChild = me.xtypeChild;

			// устанавливаем якорь в заголовок блока
			me.title = me.title + '<a name="' + me.xtype + '"></a>';

			me.cls = me.xtype;//req ? me.xtype : me.xtype + ' fieldset-optional';

			if (!me.items)
			{
				me.items = [
					{
						xtype: 'form-desc-' + xtypeChild,
						layout: 'anchor',
						defaults: {
							anchor: '100%'
						}
					}
				];
			}
			me.callParent(arguments);
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

			items.each(
				function (item)
				{
					if (item.isValid && !item.isValid())
					{
						isValid = false;
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
		}
	}
);