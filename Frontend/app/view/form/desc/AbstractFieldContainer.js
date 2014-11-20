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
		style: {
			marginBottom: '0px'
		},
		fieldDefaults: {
			labelStyle: 'font-size: 10px; line-height: 1',
			fieldStyle: 'font-size: 10px; line-height: 1'
		},
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
		}
	}
);