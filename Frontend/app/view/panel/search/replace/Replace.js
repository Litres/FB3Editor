/**
 * Панель замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.replace.Replace',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.search.replace.ReplaceController',
			'FBEditor.view.panel.search.replace.all.All',
			'FBEditor.view.panel.search.replace.current.Current',
			'FBEditor.view.panel.search.replace.textfield.Textfield'
		],
		
		id: 'panel-search-replace',
		xtype: 'panel-search-replace',
		controller: 'panel.search.replace',
		
		cls: 'panel-search-replace',
		
		layout: 'hbox',
		hidden: true,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.replace.textfield.Textfield} Поле ввода текста для замены.
		 */
		replaceField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.replace.current.Current} Кнопка замены текущего найденного
		 * совпадения.
		 */
		currentBtn: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.replace.all.All} Кнопка замены замены всех найденных
		 * совпадений.
		 */
		allBtn: null,
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					xtype: 'panel-search-replace-textfield',
					width: 300
				},
				{
					xtype: 'panel-search-replace-current'
				},
				{
					xtype: 'panel-search-replace-all'
				}
			];
			
			me.callParent(arguments);
		},
		
		/**
		 * Возвращает поле ввода текста для замены.
		 * @return {FBEditor.view.panel.search.replace.textfield.Textfield}
		 */
		getReplaceField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.searchField || me.down('panel-search-replace-textfield');
			me.searchField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает кнопку замены текущего найденного совпадения.
		 * @return {FBEditor.view.panel.search.replace.current.Current}
		 */
		getCurrentBtn: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.currentBtn || me.down('panel-search-replace-current');
			me.currentBtn = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает кнопку замены всех найденных совпадений.
		 * @return {FBEditor.view.panel.search.replace.all.All}
		 */
		getAllBtn: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.allBtn || me.down('panel-search-replace-all');
			me.allBtn = cmp;
			
			return cmp;
		}
	}
);