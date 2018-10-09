/**
 * Вкладка Файл.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.File',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.open.Open',
			'FBEditor.view.panel.toolstab.file.button.saveas.SaveAs'
		],
		id:'panel-toolstab-file',
		xtype: 'panel-toolstab-file',
		title: 'Файл',

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'panel-toolstab-file-button-open'
				},
				{
					xtype: 'panel-toolstab-file-button-saveas'
				}
			];
			
			me.callParent(arguments);
		}
	}
);