/**
 * Панель свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.Body',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		requires: [
			'FBEditor.view.panel.main.props.body.BodyController',
			'FBEditor.view.panel.main.props.body.Info'
		],
		controller: 'panel.props.body',
		id: 'panel-props-body',
		xtype: 'panel-props-body',
		listeners: {
			loadData: 'onLoadData'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'props-element-info'
				}
			];
			me.callParent(arguments);
		},

		getContentId: function ()
		{
			return 'main-editor';
		}
	}
);