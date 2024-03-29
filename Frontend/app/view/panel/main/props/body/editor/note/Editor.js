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
			'FBEditor.view.panel.main.props.body.editor.note.EditorController',
            'FBEditor.view.panel.main.props.body.editor.note.AutotextStore',
			'FBEditor.view.panel.main.props.body.editor.note.RoleStore',
			'FBEditor.view.panel.main.props.body.editor.note.href.Href',
			'FBEditor.view.panel.main.props.body.editor.note.text.Text'
		],
		
		controller: 'panel.props.body.editor.note',
		
		translateText: {
			autotext: 'Автотекст',
			role: 'Тип'
		},

		initComponent: function ()
		{
			var me = this,
				notesId,
				roleStore,
                autotextStore;

			roleStore = Ext.create('FBEditor.view.panel.main.props.body.editor.note.RoleStore');
            autotextStore = Ext.create('FBEditor.view.panel.main.props.body.editor.note.AutotextStore');
			
			notesId = me.data.notesId;

			me.items = [
				{
					xtype: 'panel-props-body-editor-fields-id'
				},
				{
					xtype: 'panel-props-body-editor-note-href',
					notesId: notesId
				},
				{
					xtype: 'combobox',
					name: 'role',
					fieldLabel: me.translateText.role,
					anchor: '100%',
                    editable: false,
					store: roleStore,
					valueField: 'value',
					value: 'auto'
				},
                {
                    xtype: 'combobox',
                    name: 'autotext',
                    fieldLabel: me.translateText.autotext,
                    anchor: '100%',
					editable: false,
                    store: autotextStore,
                    valueField: 'value',
					value: '1'
                },
				{
					xtype: 'panel-props-body-editor-note-text'
				}
			];

			me.callParent(arguments);
		},
		
		/**
		 * Возвращает кнопку перехода к тексту сноски.
		 * @return {FBEditor.view.panel.main.props.body.editor.note.text.Text}
		 */
		getNoteTextCmp: function ()
		{
			return this.down('panel-props-body-editor-note-text');
		}
	}
);