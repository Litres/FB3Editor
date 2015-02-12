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
			'FBEditor.view.panel.main.props.resources.ResourcesController',
			'FBEditor.view.panel.main.props.resources.Info',
			'FBEditor.view.button.DeleteResource'
		],
		id: 'panel-props-resources',
		xtype: 'panel-props-resources',
		controller: 'panel.props.resources',
		listeners: {
			loadData: 'onLoadData'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'props-resources-info'
				},
				{
					xtype: 'button-delete-resource',
					hidden: true
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