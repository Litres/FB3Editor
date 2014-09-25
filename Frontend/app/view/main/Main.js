/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */
Ext.define(
	'FBEditor.view.main.Main',
	{
	    extend: 'Ext.container.Container',
	    requires: [
	        'FBEditor.view.main.MainController',
	        'FBEditor.view.main.MainModel',
		    'FBEditor.view.panel.main.ToolsPanel',
	        'FBEditor.view.panel.main.NavigationPanel',
		    'FBEditor.view.panel.main.ContentPanel',
	        'FBEditor.view.panel.main.PropsPanel'
	    ],
	    xtype: 'main',
	    controller: 'main',
	    viewModel: {
	        type: 'main'
	    },
	    layout: {
	        type: 'border'
	    },

		initComponent: function ()
		{
			var me = this;

			if (!FBEditor.parentWindow)
			{
				me.items = [
					{
						xtype: 'panel-main-tools'
					},
					{
						xtype: 'panel-main-navigation',
						width: '15%',
						region: 'west',
						maximize: true,
						collapsible: true
					},
					{
						xtype: 'panel-main-content'
					},
					{
						xtype: 'panel-main-props',
						width: '15%',
						region: 'east',
						maximize: true,
						collapsible: true
					}
				];
			}
			me.callParent(arguments);
		},

		/**
		 * Добавляет панель.
		 * @param {String} name Имя панели.
		 */
		addPanel: function (name)
		{
			var me = this,
				xtype,
				panel;

			xtype = 'panel-main-' + name;
			panel = me.add(
				{
					xtype: xtype,
					region: 'center'
				}
			);
			document.title = document.title + ' - ' + panel.title;
		}
	}
);
