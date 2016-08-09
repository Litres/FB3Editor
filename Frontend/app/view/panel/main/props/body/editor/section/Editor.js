/**
 * Панель редактирования элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.section.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

		translateText: {
			article: 'article'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					name: 'id',
					fieldLabel: 'ID',
					anchor: '100%',
					allowBlank: false
				}/*,
				{
					xtype: 'checkbox',
					name: 'article',
					labelAlign: 'left',
					labelWidth: 50,
					fieldLabel: me.translateText.article,
					inputValue: 'true'
				}*/
			];

			me.callParent(arguments);
		}
	}
);