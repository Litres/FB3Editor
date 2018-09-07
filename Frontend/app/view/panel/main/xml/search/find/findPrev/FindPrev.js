/**
 * Кнопка перемещения к предыдущему результату поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.findPrev.FindPrev',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.panel.main.xml.search.find.findPrev.FindPrevController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-find-findprev',
		controller: 'panel.xml.search.find.findprev',
		
		cls: 'panel-xml-search-findprev',
		
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},
		
		translateText: {
			title: 'Предыдущее совпадение'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.html = '<i title="' + tt.title + '" class="fa fa-arrow-up"></i>';
			
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