/**
 * Кнопка замены текущего найденного совпадения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.replace.current.Current',
	{
		extend: 'Ext.Button',
		mixins: {
			cmp: 'FBEditor.view.panel.search.AbstractComponent'
		},
		
		xtype: 'panel-search-replace-current',
		
		cls: 'panel-search-replace-current',
		
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