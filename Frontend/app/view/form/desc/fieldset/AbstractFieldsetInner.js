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
			resetFields: 'onResetFields'
		},

		/**
		 * @property {Boolean} Обязательный ли блок.
		 */
		require: false,

		initComponent: function ()
		{
			var me = this,
				req = me.require;

			me.collapsed = req ? false : true;
			me.cls += req ? '' : ' fieldset-optional';
			me.callParent(arguments);
		}
	}
);