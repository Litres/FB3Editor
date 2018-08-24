/**
 * Поле количества найденных совпадений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.count.Count',
	{
		extend: 'Ext.Component',
		
		xtype: 'panel-xml-search-count',
		
		cls: 'panel-xml-search-count',

		tpl: '<tpl if="count">Найдено {count}</tpl>',
		
		/**
		 * Устанавливает количество.
		 * @param {Number} count
		 */
		setCount: function (count)
		{
			var me = this;
			
			me.setData(
				{
					count: count
				}
			);
		}
	}
);