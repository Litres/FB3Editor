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
			change: 'onChange',
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
		},

		getDocMarkup: function() {
			var me = this,
				h = me.iframeEl.getHeight() - me.iframePad * 2;

			// - IE9+ require a strict doctype otherwise text outside visible area can't be selected.
			// - Opera inserts <P> tags on Return key, so P margins must be removed to avoid double line-height.
			// - On browsers other than IE, the font is not inherited by the IFRAME so it must be specified.
			return Ext.String.format(
				'<!DOCTYPE html>'
				+ '<html><head>'
				+ '<link href="resources/css/editor.css" rel="stylesheet" type="text/css" /><style type="text/css">'
				+ (Ext.isOpera ? 'p{margin:0;}' : '')
				+ 'body{border:0;margin:0;padding:{0}px;direction:' + (me.rtl ? 'rtl;' : 'ltr;')
				+ (Ext.isIE8 ? Ext.emptyString : 'min-')
				+ 'height:{1}px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;background-color:white;'
				+ (Ext.isIE ? '' : 'font-size:12px;font-family:{2}')
				+ '}</style></head><body></body></html>'
				, me.iframePad, h, me.defaultFont);
		}
	}
);