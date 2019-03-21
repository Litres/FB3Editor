/**
 * Ссылка на сноску.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.note.href.Href',
	{
		extend: 'Ext.form.field.ComboBox',
		
		xtype: 'panel-props-body-editor-note-href',
		
		name: 'href',
		anchor: '100%',
		allowBlank: false,
		editable: false,
		
		/**
		 * @protected
		 * @property {String[]} Айди сносок.
		 */
		notesId: null,
		
		translateText: {
			href: 'Ссылка'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.fieldLabel = tt.href;
			
			// список всех айди сносок
			me.setStore(me.notesId);
			
			me.callParent(arguments);
		}
	}
);