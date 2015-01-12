/**
 * Абстрактный класс для вложенных fieldset формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.AbstractFieldsetInner',
	{
		extend: 'Ext.form.FieldSet',
		requires: [
			'FBEditor.view.form.desc.fieldset.AbstractFieldsetInnerController'
		],
		xtype: 'desc-fieldsetinner',
		controller: 'desc.fieldsetinner',
		collapsible: true,
		anchor: '100%',
		cls: 'fieldset-inner',
		listeners: {
			resetFields: 'onResetFields',
			checkExpand: 'onCheckExpand'
		},

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
				req = me.require;

			me.collapsed = req ? false : true;
			me.cls += req ? '' : ' fieldset-optional';
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
		}
	}
);