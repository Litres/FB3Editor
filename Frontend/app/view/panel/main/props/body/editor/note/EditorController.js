/**
 * Контроллер панели note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.note.EditorController',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditorController',
		
		alias: 'controller.panel.props.body.editor.note',
		
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				textCmp;
			
			me.callParent(arguments);
			
			// обновляем
			textCmp = view.getNoteTextCmp();
			textCmp.updateView();
		}
		
	}
);