/**
 * Панель свойств редактора ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.resources.Resources',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		requires: [
			'FBEditor.view.button.LoadResource'
		],
		id: 'panel-props-resources',
		xtype: 'panel-props-resources',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'button-load-resource'
				}
			];
			me.callParent(arguments);
		},

		getContentId: function ()
		{
			return 'panel-resources';
		}
	}
);