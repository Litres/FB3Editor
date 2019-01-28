/**
 * Поле ввода текста для замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.search.replace.textfield.Textfield',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.panel.search.replace.textfield.TextfieldController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.search.AbstractComponent'
		},
		
		xtype: 'panel-search-replace-textfield',
		controller: 'panel.search.replace.textfield',
		
		listeners: {
			change: 'onChange',
			keydown: 'onKeyDown'
		},
		
		enableKeyEvents: true,
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);