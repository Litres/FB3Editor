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
			'FBEditor.view.button.DeleteResource',
			'FBEditor.view.button.SaveResource',
			'FBEditor.view.button.MoveResource'
		],

		id: 'panel-props-resources',
		xtype: 'panel-props-resources',
		controller: 'panel.props.resources',

		listeners: {
			loadData: 'onLoadData',
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		defaults: {
			hidden: true,
			margin: '2 0'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'props-resources-info'
				},
				{
					xtype: 'button-delete-resource'
				},
				{
					xtype: 'button-save-resource'
				},
				{
					xtype: 'button-move-resource'
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