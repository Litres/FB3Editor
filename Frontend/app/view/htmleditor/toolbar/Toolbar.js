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

		/**
		 * Инициализация тулбара.
		 * @param {Ext.toolbar.Toolbar} toolbar Тулбар от htmleditor.
		 */
		constructor: function (toolbar)
		{
			var me = this;

			return toolbar;
		}
	}
);