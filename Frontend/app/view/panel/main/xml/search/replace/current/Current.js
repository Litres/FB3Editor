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
		
		afterRender: function ()
		{
			var me = this,
				panel = me.getSearchPanel();
			
			// добавляем кнопку для синхронизации с полем поиска
			panel.addButtonSync(me);
			
			me.callParent(arguments);
		},
		
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