/**
 * Кнопки для перехода к сноскам в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.notebody.notes.Notes',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.notebody.notes.button.Button'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.props.body.editor.MixedComponent'
		},
		
		xtype: 'panel-props-body-editor-notebody-notes',
		
		layout: 'vbox',
		
		/**
		 * Возвращает родительскую панель.
		 * @return {FBEditor.view.panel.main.props.body.editor.AbstractEditor}
		 */
		getPanel: function ()
		{
			return this.mixins.cmp.getPanel.call(this);
		},
		
		/**
		 * Обновляет отображение кнопок.
		 */
		updateView: function ()
		{
			var me = this,
				cmps = [],
				panel,
				el,
				manager,
				noteManager,
				notes;
			
			panel = me.getPanel();
			el = panel.getElement();
			manager = el.getManager();
			noteManager = manager.getNoteManager();
			notes = noteManager.getNotesByNotebody(el);
			
			me.removeAll(true);
			
			Ext.each(
				notes,
				function (note, i)
				{
					var number = notes.length > 1 ? i + 1 : 0;
					
					cmps.push(
						{
							xtype: 'panel-props-body-editor-notebody-notes-button',
							noteEl: note,
							number: number
						}
					);
				}
			);
			
			if (cmps.length)
			{
				me.add(cmps);
			}
		}
	}
);