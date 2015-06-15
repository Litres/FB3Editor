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
			'FBEditor.view.panel.editor.Editor',
			'FBEditor.view.form.desc.Desc',
			'FBEditor.view.panel.resources.Resources'
		],
		id: 'panel-main-content',
		xtype: 'panel-main-content',
		controller: 'panel.main.content',
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'card',
		minWidth: 610,
		overflowX: true,
		margin: '0 2px 0 2px',
		bodyPadding: 0,
		//activeItem: 'main-editor',
		items: [
			{
				xtype: 'form-desc'
			},
			{
				xtype: 'panel-resources'
			},
			{
				xtype: 'main-editor'
			}
		],
		listeners: {
			resize: 'onResize',
			contentBody: 'onContentBody',
			contentDesc: 'onContentDesc',
			contentResources: 'onContentResources'
		},

		afterRender: function ()
		{
			var me = this;

			Ext.defer(
				function ()
				{
					// переключаем контекст на текст
					Ext.create('FBEditor.command.OpenBody').execute();
				},
			    2000
			);
			me.callParent(arguments);
		}
    }
);