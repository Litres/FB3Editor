/**
 * Контроллер кнопки замены.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.button.replace.ReplaceController',
	{
		extend: 'FBEditor.view.panel.toolstab.button.AbstractButtonController',
		
		alias: 'controller.panel.toolstab.button.replace',
		
		onClick: function (e)
		{
			var me = this,
				manager = FBEditor.getEditorManager();
			
			// поиск по тексте
			manager.doReplace();
		}
	}
);