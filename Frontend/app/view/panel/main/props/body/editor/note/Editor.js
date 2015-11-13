/**
 * Панель редактирования элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.note.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.note.RoleStore'
		],

		translateText: {
			href: 'Ссылка',
			autotext: 'Автотекст',
			role: 'Тип'
		},

		initComponent: function ()
		{
			var me = this,
				roleStore;

			roleStore = Ext.create('FBEditor.view.panel.main.props.body.editor.note.RoleStore');

			me.items = [
				{
					name: 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					name: 'href',
					fieldLabel: me.translateText.href,
					anchor: '100%',
					allowBlank: false
				},
				{
					xtype: 'combobox',
					name: 'role',
					fieldLabel: me.translateText.role,
					anchor: '100%',
					store: roleStore,
					valueField: 'value'
				},
				{
					xtype: 'checkbox',
					name: 'autotext',
					fieldLabel: me.translateText.autotext,
					labelAlign: 'left',
					labelWidth: 70,
					inputValue: 'true'
				}
			];

			me.callParent(arguments);
		}
	}
);