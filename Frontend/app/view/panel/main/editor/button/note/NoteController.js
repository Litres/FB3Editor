/**
 * Контроллер сноски.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.note.NoteController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		
		alias: 'controller.main.editor.button.note',
		
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				range = manager.getRange(),
				el,
				name,
				disable;
			
			el = manager.getFocusElement();
			
			if (!el)
			{
				btn.disable();
				
				return;
			}
			
			name = btn.elementName;
			disable = el.hisName(name) || el.hasParentName(name) || !range.collapsed;
			
			if (!disable)
			{
				btn.enable();
			}
			else
			{
				btn.disable();
			}
		}
	}
);