/**
 * Панель поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.Find',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.search.find.FindController',
			'FBEditor.view.panel.search.find.ignoreCase.IgnoreCase',
			'FBEditor.view.panel.search.find.count.Count',
			'FBEditor.view.panel.search.find.findNext.FindNext',
			'FBEditor.view.panel.search.find.findPrev.FindPrev',
			'FBEditor.view.panel.search.find.regex.Regex',
			'FBEditor.view.panel.search.find.textfield.Textfield',
			'FBEditor.view.panel.search.find.words.Words'
		],
		
		xtype: 'panel-search-find',
		controller: 'panel.search.find',
		
		cls: 'panel-search-find',
		
		layout: 'hbox',
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.find.textfield.Textfield} Поле ввода текста для поиска.
		 */
		searchField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.find.regex.Regex} Чекбокс установки регулярного поиска.
		 */
		regexField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.find.ignoreCase.IgnoreCase} Чекбокс установки учитывания регистра.
		 */
		caseField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.find.words.Words} Чекбокс установки поиска слов.
		 */
		wordsField: null,
		
		/**
		 * @private
		 * @property {FBEditor.view.panel.search.find.count.Count} Поле количества найденных результатов.
		 */
		countField: null,
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					xtype: 'panel-search-find-textfield',
					width: 300
				},
				{
					xtype: 'panel-search-find-findprev'
				},
				{
					xtype: 'panel-search-find-findnext'
				},
				{
					xtype: 'panel-search-find-ignorecase'
				},
				{
					xtype: 'panel-search-find-words',
					hidden: true
				},
				{
					xtype: 'panel-search-find-regex'
				},
				{
					xtype: 'panel-search-find-count'
				}
			];
			
			me.callParent(arguments);
		},
		
		/**
		 * Возвращает поле ввода текста для поиска.
		 * @return {FBEditor.view.panel.search.find.textfield.Textfield}
		 */
		getSearchField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.searchField || me.down('panel-search-find-textfield');
			me.searchField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает чекбокс установки регулярного поиска.
		 * @return {FBEditor.view.panel..search.find.regex.Regex}
		 */
		getRegexField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.regexField || me.down('panel-search-find-regex');
			me.regexField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает чекбокс установки учитывания регистра.
		 * @return {FBEditor.view.panel.search.find.ignoreCase.IgnoreCase}
		 */
		getCaseField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.caseField || me.down('panel-search-find-ignorecase');
			me.caseField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает чекбокс установки поиска слов.
		 * @return {FBEditor.view.panel.search.find.words.Words}
		 */
		getWordsField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.wordsField || me.down('panel-search-find-words');
			me.wordsField = cmp;
			
			return cmp;
		},
		
		/**
		 * Возвращает поле количества найденных результатов.
		 * @return {FBEditor.view.panel.search.find.count.Count}
		 */
		getCountField: function ()
		{
			var me = this,
				cmp;
			
			cmp = me.countField || me.down('panel-search-find-count');
			me.countField = cmp;
			
			return cmp;
		}
	}
);