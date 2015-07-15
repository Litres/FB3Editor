/**
 * Панель редактирования элемента notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.notes.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

		translateText: {
			show: 'show'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'checkbox',
					name: 'show',
					labelAlign: 'left',
					labelWidth: 50,
					fieldLabel: me.translateText.show,
					inputValue: 'true'
				}
			];

			me.callParent(arguments);
		}
	}
);