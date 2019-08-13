/**
 * Кнопка перехода к сноске в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.notebody.notes.button.Button',
	{
		extend: 'Ext.button.Button',
		mixins: {
			cmp: 'FBEditor.view.panel.main.props.body.editor.MixedComponent'
		},
		
		xtype: 'panel-props-body-editor-notebody-notes-button',
		
		width: '100%',
		margin: '4 0 0 0',
		
		/**
		 * @property {FBEditor.editor.element.notebody.NoteElement} Сноска.
		 */
		noteEl: null,
		
		/**
		 * @property {Number} Порядковый номер сноски.
		 */
		number: 1,
		
		text: 'Перейти к сноске',
		
		initComponent: function ()
		{
			var me = this;
			
			me.text += ' ' + me.number;
			
			me.callParent(arguments);
		},
		
		handler: function ()
		{
			var me = this,
				el = me.noteEl,
				manager = el.getManager(),
				noteManager = manager.getNoteManager();
			
			// переходим к сноске в тексте
			noteManager.toNote(el)
		},
		
		/**
		 * Возвращает родительскую панель.
		 * @return {FBEditor.view.panel.main.props.body.editor.AbstractEditor}
		 */
		getPanel: function ()
		{
			return this.mixins.cmp.getPanel.call(this);
		}
	}
);