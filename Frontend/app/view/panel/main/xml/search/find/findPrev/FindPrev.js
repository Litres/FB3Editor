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
		
		html: '<i class="fa fa-arrow-up"></i>',
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);