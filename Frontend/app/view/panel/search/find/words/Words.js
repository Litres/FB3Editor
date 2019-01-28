/**
 * Чекбокс установки поиска слов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.words.Words',
	{
		extend: 'Ext.form.field.Checkbox',
		requires: [
			'FBEditor.view.panel.search.find.words.WordsController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.search.AbstractComponent'
		},
		
		xtype: 'panel-search-find-words',
		controller: 'panel.search.find.words',
		
		cls: 'panel-search-words',

		listeners: {
			change: 'onChange'
		},
		
		translateText: {
			words: 'Слова'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.boxLabel = tt.words;
			
			me.callParent(arguments);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);