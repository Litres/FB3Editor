/**
 * Панель навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.NavigationPanel',
    {
        extend: 'FBEditor.view.panel.main.AbstractMaximizePanel',
	    xtype: 'panel-main-navigation',
        title: 'Навигация',
        html: 'Содержимое левой панели',
	    panelName: 'navigation'
    }
);