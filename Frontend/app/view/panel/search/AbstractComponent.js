/**
 * Абстрактный класс компонента панели поиска.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.AbstractComponent',
	{
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.Search} Панель поиска.
		 */
		searchPanel: null,
		
		/**
		 * Возвращает панель поиска.
		 * @return {FBEditor.view.panel.search.Search}
		 */
		getSearchPanel: function ()
		{
			var me = this,
				panel;
			
			panel = me.searchPanel || me.up('panel-search');
			me.searchPanel = panel;
			
			return panel;
		}
	}
);