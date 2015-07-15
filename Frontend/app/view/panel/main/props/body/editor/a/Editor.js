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
					name: 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					name: 'href',
					fieldLabel: me.translateText.href,
					anchor: '100%'
				}
			];

			me.callParent(arguments);
		},

		updateData: function (data, isLoad)
		{
			var me = this;

			me.callParent(arguments);
			me.getForm().setValues(data);
			me.isLoad = false;
		}
	}
);