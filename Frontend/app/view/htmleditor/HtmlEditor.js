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
		},

		/**
		 * Возвращает данные в виде строки xml.
		 * @return {String} строка xml.
		 */
		getXml: function ()
		{
			var me = this,
				xml,
				xsl,
				patternMap;

			patternMap = [
				{
					pattern: '<(br.*?|img.*?)>',
					replacement: '<$1/>'
				},
				{
					pattern: '&nbsp;',
					replacement: ' '
				}
			];
			xml = me.getValue();
			Ext.each(
				patternMap,
			    function (item)
			    {
				    var pattern;

				    pattern = new RegExp(item.pattern, 'gi');
				    xml = xml.replace(pattern, item.replacement);
			    }
			);
			//console.log(xml);
			xml = '<?xml version="1.0" encoding="UTF-8"?><fb3-body xmlns:l="http://www.w3.org/1999/xlink" id=""\
				xmlns="http://www.fictionbook.org/FictionBook3/body"\
				xmlns:fb3d="http://www.fictionbook.org/FictionBook3/description">' + xml + '</fb3-body>';
			xsl = FBEditor.xsl.Body.getHtmlToXml();
			xml = FBEditor.util.xml.Jsxml.trans(xml, xsl);
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			//console.log(xml);

			return xml;
		}
	}
);