/**
 * Кнопка перемещения к следующему результату поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.findNext.FindNext',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.panel.main.xml.search.find.findNext.FindNextController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-find-findnext',
		controller: 'panel.xml.search.find.findnext',
		
		cls: 'panel-xml-search-findnext',
		
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},
		
		translateText: {
			title: 'Следующее совпадение'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.html = '<i title="' + tt.title + '" class="fa fa-arrow-down"></i>';
			
			me.callParent(arguments);
		},
		
		afterRender: function ()
		{
			var me = this,
				panel = me.getSearchPanel();
			
			// добавляем кнопку для синхронизации с полем поиска
			panel.addButtonSync(me);
			
			me.callParent(arguments);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);