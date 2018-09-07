/**
 * Панель замены по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.replace.Replace',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.xml.search.replace.ReplaceController',
			'FBEditor.view.panel.main.xml.search.replace.all.All',
			'FBEditor.view.panel.main.xml.search.replace.current.Current',
			'FBEditor.view.panel.main.xml.search.replace.textfield.Textfield'
		],
		
		id: 'panel-xml-search-replace',
		xtype: 'panel-xml-search-replace',
		controller: 'panel.xml.search.replace',
		
		cls: 'panel-xml-search-replace',
		
		layout: 'hbox',
		hidden: true,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.main.xml.search.replace.textfield.Textfield} Поле ввода текста для замены.
		 */
		replaceField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.main.xml.search.replace.current.Current} Кнопка замены текущего найденного
		 * совпадения.
		 */
		currentBtn: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.main.xml.search.replace.all.All} Кнопка замены замены всех найденных
		 * совпадений.
		 */
		allBtn: null,
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					xtype: 'panel-xml-search-replace-textfield',
					width: 300
				},
				{
					xtype: 'panel-xml-search-replace-current'
				},
				{
					xtype: 'panel-xml-search-replace-all'
				}
			];
			
			me.callParent(arguments);
		},
		
		/**
		 * Возвращает поле ввода текста для замены.
		 * @return {FBEditor.view.panel.main.xml.search.replace.textfield.Textfield}
		 */
		getReplaceField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.searchField || me.down('panel-xml-search-replace-textfield');
			me.searchField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает кнопку замены текущего найденного совпадения.
		 * @return {FBEditor.view.panel.main.xml.search.replace.current.Current}
		 */
		getCurrentBtn: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.currentBtn || me.down('panel-xml-search-replace-current');
			me.currentBtn = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает кнопку замены всех найденных совпадений.
		 * @return {FBEditor.view.panel.main.xml.search.replace.all.All}
		 */
		getAllBtn: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.allBtn || me.down('panel-xml-search-replace-all');
			me.allBtn = cmp;
			
			return cmp;
		}
	}
);