/**
 * Панель свойств.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.PropsPanel',
	{
		extend: 'FBEditor.view.panel.main.AbstractMaximizePanel',
		xtype: 'panel-main-props',
        title: 'Свойства',
        html: 'Содержимое правой панели',
		panelName: 'props'
    }
);