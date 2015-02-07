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
			'FBEditor.view.panel.main.props.PropsController',
			'FBEditor.view.panel.main.props.Card'
		],
		id: 'panel-main-props',
		xtype: 'panel-main-props',
		controller: 'panel.main.props',
		panelName: 'props',
        title: 'Свойства',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-main-props-card'
				}
			];
			me.callParent(arguments);
		}
    }
);