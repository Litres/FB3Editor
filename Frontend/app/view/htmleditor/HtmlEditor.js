/**
 * Редактор HTML содержимого книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.htmleditor.HtmlEditor',
	{
		extend: 'Ext.form.field.HtmlEditor',
		requires: [
			'FBEditor.view.htmleditor.HtmlEditorController'
		],
		id: 'main-htmleditor',
		xtype: 'main-htmleditor',
		controller: 'view.htmleditor',
		listeners: {
			initialize: 'onInitialize',
			loadtext: 'onLoadText'
		},

		/**
		 * Возвращает тулбар.
		 * @return {FBEditor.view.htmleditor.toolbar.Toolbar} Тулбар.
		 */
		getToolbar: function ()
		{
			var me = this,
				toolbar;

			toolbar = Ext.getCmp('htmleditor-toolbar') ||
			          Ext.create('FBEditor.view.htmleditor.toolbar.Toolbar', me.toolbar);

			return toolbar;
		}
	}
);