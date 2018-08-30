/**
 * Чекбокс установки регистра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.ignoreCase.IgnoreCase',
	{
		extend: 'Ext.form.field.Checkbox',
		requires: [
			'FBEditor.view.panel.main.xml.search.find.ignoreCase.IgnoreCaseController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-find-ignorecase',
		controller: 'panel.xml.search.find.ignorecase',
		
		cls: 'panel-xml-search-ignorecase',
		
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