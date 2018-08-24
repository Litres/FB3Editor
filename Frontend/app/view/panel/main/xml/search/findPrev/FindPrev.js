/**
 * Кнопка перемещения к предыдущему результату поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.findPrev.FindPrev',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.panel.main.xml.search.findPrev.FindPrevController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-findprev',
		controller: 'panel.xml.search.findprev',
		
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