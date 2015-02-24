/**
 * Панель управления ресурсами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.control.Control',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.button.LoadResource',
			'FBEditor.view.button.CreateFolderResource',
			'FBEditor.view.panel.resources.control.selectview.SelectView'
		],
		xtype: 'panel-resources-control',
		id: 'panel-resources-control',
		layout: 'hbox',
		defaults: {
			margin: '5'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'button-load-resource'
				},
				{
					xtype: 'button-createfolder-resource'
				},
				{
					xtype: 'panel-resources-selectview'
				}
			];
			me.callParent(arguments);
		}
	}
);