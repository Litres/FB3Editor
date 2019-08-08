/**
 * Кнотроллер элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElementController',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElementController',
		
		getNodeVerify: function (sel, opts)
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				range;
			
			range = manager.getRangeCursor();
			
			return range.start;
		}
	}
);