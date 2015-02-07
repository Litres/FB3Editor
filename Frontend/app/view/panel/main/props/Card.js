/**
 * Внутрення панель свойств для переключения контекста свойств.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.Card',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.main.props.CardController',
			'FBEditor.view.panel.main.props.desc.Desc',
			'FBEditor.view.panel.main.props.resources.Resources',
			'FBEditor.view.panel.main.props.body.Body'
		],
		id: 'panel-main-props-card',
		xtype: 'panel-main-props-card',
		controller: 'panel.main.props.card',
		layout: 'card',
		listeners: {
			activePanelResources: 'onActivePanelResources',
			activePanelDesc: 'onActivePanelDesc',
			activePanelBody: 'onActivePanelBody'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-desc'
				},
				{
					xtype: 'panel-props-resources'
				},
				{
					xtype: 'panel-props-body'
				}
			];
			me.callParent(arguments);
		}
	}
);