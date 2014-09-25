/**
 * Контроллер панели навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.navigation.NavigationController',
    {
        extend: 'FBEditor.view.panel.main.DetachController',
	    alias: 'controller.panel.main.navigation',

	    onDetachPanel: function (panel)
	    {
		    var me = this;

		    me.callParent(arguments);
	    }
    }
);