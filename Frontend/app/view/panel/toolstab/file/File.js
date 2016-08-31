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
			'FBEditor.view.panel.toolstab.file.button.saveas.SaveAs',
			'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDesc',
			'FBEditor.view.panel.toolstab.file.button.savebody.SaveBody'
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
				},
				{
					xtype: 'panel-toolstab-file-button-savedesc'
				},
				{
					xtype: 'panel-toolstab-file-button-savebody'
				}
			];
			
			me.callParent(arguments);
		}
	}
);