/**
 * Кнопка открытия файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.open.Open',
	{
		extend: 'FBEditor.view.button.AbstractFileButton',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.open.OpenController'
		],
		
		id: 'panel-toolstab-file-button-open',
		xtype: 'panel-toolstab-file-button-open',
		controller: 'panel.toolstab.file.button.open',
		
		listeners: {
			change: 'onChange'
		},

		//iconCls: 'fa fa-upload',
		tooltipType: 'title',

		accept: '', //'application/zip'

		translateText: {
			open: 'Открыть книгу (локально)'
		},

		initComponent: function ()
		{
			var me = this;

			me.text = me.translateText.open;
			me.tooltip = me.translateText.open;

			me.callParent(arguments);
		}
	}
);