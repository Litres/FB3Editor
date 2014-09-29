/**
 * Панель свойств.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.Props',
	{
		extend: 'FBEditor.view.panel.main.AbstractDetach',
		requires: [
			'FBEditor.view.panel.main.props.PropsController'
		],
		id: 'panel-main-props',
		xtype: 'panel-main-props',
		controller: 'panel.main.props',
		panelName: 'props',
        title: 'Свойства',
        html: 'Содержимое правой панели'
    }
);