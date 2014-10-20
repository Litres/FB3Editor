/**
 * Окно описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.desc.Desc',
	{
		extend: 'Ext.window.Window',
		requires: [
			'FBEditor.view.window.desc.Form'
		],
		id: 'window-desc',
		xtype: 'window-desc',
		closeAction: 'hide',
		modal: true,
		maximized: true,
		autoScroll: true,
		title: 'Описание книги',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'window-desc-form'
				}
			];
			me.callParent(arguments);
		}
	}
);