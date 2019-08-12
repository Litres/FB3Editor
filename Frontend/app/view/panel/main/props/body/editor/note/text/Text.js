/**
 * Кнопка перехода к тексту сноски.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.note.text.Text',
	{
		extend: 'Ext.button.Button',
		mixins: {
			cmp: 'FBEditor.view.panel.main.props.body.editor.MixedComponent'
		},
		
		xtype: 'panel-props-body-editor-note-text',
		
		anchor: '100%',
		margin: '10 0 0 0',
		
		text: 'Перейти к тексту сноски',
		
		translateText: {
			titleAlert: 'Ошибка',
			msgAlert: 'Отсутствует текст сноски!'
		},
		
		handler: function ()
		{
			var me = this,
				panel = me.getPanel(),
				el = panel.getElement(),
				manager = el.getManager(),
				noteManager = manager.getNoteManager();
			
			// переходим к тексту сноски
			if (!noteManager.toNotebody(el))
			{
				Ext.Msg.alert(me.translateText.titleAlert, me.translateText.msgAlert);
			}
		},
		
		/**
		 * Возвращает родительскую панель.
		 * @return {FBEditor.view.panel.main.props.body.editor.AbstractEditor}
		 */
		getPanel: function ()
		{
			return this.mixins.cmp.getPanel.call(this);
		},
		
		/**
		 * Обновляет отображение кнопки.
		 */
		updateView: function ()
		{
			var me = this,
				panel,
				el,
				manager,
				noteManager,
				notebody;
			
			panel = me.getPanel();
			el = panel.getElement();
			manager = el.getManager();
			noteManager = manager.getNoteManager();
			notebody = noteManager.getNotebodyByNote(el);
			
			me.setHidden(!notebody);
		}
	}
);