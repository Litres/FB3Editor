/**
 * Кнопка замены всех найденных совпадений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.replace.all.All',
	{
		extend: 'Ext.Button',
		mixins: {
			cmp: 'FBEditor.view.panel.search.AbstractComponent'
		},
		
		xtype: 'panel-search-replace-all',
		
		cls: 'panel-search-replace-all',
		
		hidden: true,
		text: 'Заменить все',
		
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
				all = true,
				searchPanel;
			
			// выполняем замену всех совпадений
			searchPanel = me.getSearchPanel();
			searchPanel.replace(all);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);