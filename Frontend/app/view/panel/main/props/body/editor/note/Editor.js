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
            'FBEditor.view.panel.main.props.body.editor.note.AutotextStore',
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
				roleStore,
                autotextStore;

			roleStore = Ext.create('FBEditor.view.panel.main.props.body.editor.note.RoleStore');
            autotextStore = Ext.create('FBEditor.view.panel.main.props.body.editor.note.AutotextStore');

			me.items = [
				{
					xtype: 'panel-props-body-editor-fields-id'
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
					valueField: 'value',
					value: 'auto'
				},
                {
                    xtype: 'combobox',
                    name: 'autotext',
                    fieldLabel: me.translateText.autotext,
                    anchor: '100%',
                    store: autotextStore,
                    valueField: 'value',
					value: '1'
                }
			];

			me.callParent(arguments);
		}
	}
);