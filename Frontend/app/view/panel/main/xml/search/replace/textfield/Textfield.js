/**
 * Поле ввода текста для замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.replace.textfield.Textfield',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.panel.main.xml.search.replace.textfield.TextfieldController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-replace-textfield',
		controller: 'panel.xml.search.replace.textfield',
		
		listeners: {
			change: 'onChange',
			keydown: 'onKeydown'
		},
		
		enableKeyEvents: true,
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);