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
		    'FBEditor.view.panel.main.tools.Tools',
	        'FBEditor.view.panel.main.navigation.Navigation',
		    'FBEditor.view.panel.main.content.Content',
	        'FBEditor.view.panel.main.props.Props'
	    ],
		id: 'main',
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
						xtype: 'panel-main-content'
					}
				];
				if (!localStorage.getItem('navigation'))
				{
					me.items.push(
						{
							xtype: 'panel-main-navigation',
							width: '15%',
							region: 'west',
							maximize: true,
							collapsible: true
						}
					);
				}
				if (!localStorage.getItem('props'))
				{
					me.items.push(
						{
							xtype: 'panel-main-props',
							width: '15%',
							region: 'east',
							maximize: true,
							collapsible: true
						}
					);
				}
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
