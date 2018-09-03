/**
 * Кнопка замены текущего найденного совпадения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.replace.current.Current',
	{
		extend: 'Ext.Button',
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-replace-current',
		
		cls: 'panel-xml-search-replace-current',
		
		text: 'Заменить',
		
		handler: function ()
		{
			var me = this,
				searchPanel;
			
			// выполняем замену
			searchPanel = me.getSearchPanel();
			searchPanel.replace();
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);