/**
 * Вкладка Форматирование.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.Main',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.title.Title'
		],
		id:'panel-toolstab-main',
		xtype: 'panel-toolstab-main',
		title: 'Форматирование',

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'panel-toolstab-main-button-title'
				}
			];
			me.callParent(arguments);
		}
	}
);