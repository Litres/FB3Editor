/**
 * Чекбокс установки регистра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.find.ignoreCase.IgnoreCase',
	{
		extend: 'Ext.form.field.Checkbox',
		requires: [
			'FBEditor.view.panel.search.find.ignoreCase.IgnoreCaseController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.search.AbstractComponent'
		},
		
		xtype: 'panel-search-find-ignorecase',
		controller: 'panel.search.find.ignorecase',
		
		cls: 'panel-search-ignorecase',
		
		listeners: {
			change: 'onChange'
		},
		
		translateText: {
			ignoreCase: 'Регистр'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.boxLabel = tt.ignoreCase;
			
			me.callParent(arguments);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);