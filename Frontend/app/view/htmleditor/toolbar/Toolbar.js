/**
 * Инструменты редактора HTML.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.htmleditor.toolbar.Toolbar',
	{
		extend: 'Ext.toolbar.Toolbar',
		requires: [
			'FBEditor.view.htmleditor.toolbar.ToolbarController',
			'FBEditor.view.htmleditor.HtmlEditor'
		],
		id: 'htmleditor-toolbar',
		xtype: 'htmleditor-toolbar',
		controller: 'view.htmleditor.toolbar',

		constructor: function ()
		{
			var me = this,
				editor;

			me.callParent(arguments);
			editor = Ext.getCmp('main-htmleditor') || Ext.create('FBEditor.view.htmleditor.HtmlEditor');

			return editor.getToolbar();
		}
	}
);