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
			'FBEditor.view.htmleditor.HtmlEditor',
			'FBEditor.view.form.desc.Desc'
		],
		id: 'panel-main-content',
		xtype: 'panel-main-content',
		controller: 'panel.main.content',
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'card',
		overflowX: true,
		margin: '0 2px 0 2px',
		bodyPadding: 0,
		items: [
			{
				xtype: 'main-htmleditor'
			},
			{
				xtype: 'form-desc'
			}
		],
		listeners: {
			contentEditor: 'onContentEditor',
			contentDesc: 'onContentDesc'
		}
    }
);