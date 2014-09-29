/**
 * Панель контента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.content.Content',
	{
		extend: 'FBEditor.view.panel.main.Abstract',
		requires: [
			'FBEditor.view.panel.main.content.ContentController',
			'FBEditor.view.panel.main.content.ContentModel',
			'FBEditor.view.htmleditor.HtmlEditor'
		],
		id: 'panel-main-content',
		xtype: 'panel-main-content',
		controller: 'panel.main.content',
		viewModel: {
			type: 'panel.main.content'
		},
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'fit',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'htmleditor'
				}
			];
			me.callParent(arguments);
		}
    }
);