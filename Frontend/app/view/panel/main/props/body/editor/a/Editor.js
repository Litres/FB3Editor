/**
 * Панель редактирования элемента a.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.a.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

		translateText: {
			href: 'Ссылка'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-body-editor-fields-id'
				},
				{
					name: 'href',
					fieldLabel: me.translateText.href,
					anchor: '100%',
					allowBlank: false
				}
			];

			me.callParent(arguments);
		}
	}
);