/**
 * Панель навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.navigation.Navigation',
    {
        extend: 'FBEditor.view.panel.main.AbstractDetach',
	    requires: [
		    'FBEditor.view.panel.main.navigation.NavigationController',
		    'FBEditor.view.button.Desc',
		    'FBEditor.view.button.Resources',
		    'FBEditor.view.button.Body'
	    ],
	    id: 'panel-main-navigation',
	    xtype: 'panel-main-navigation',
	    controller: 'panel.main.navigation',
	    panelName: 'navigation',
        title: 'Навигация',
	    listeners: {
		    afterrender: 'onRender'
	    },

	    initComponent: function ()
	    {
		    var me = this;

		    me.items = [
			    {
				    xtype: 'button-desc'
			    },
			    {
				    xtype: 'button-resources'
			    },
			    {
				    xtype: 'button-body'
			    }
		    ];
		    me.callParent(arguments);
	    }
    }
);