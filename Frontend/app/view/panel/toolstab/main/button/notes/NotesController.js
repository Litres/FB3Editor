/**
 * Контроллер кнопки notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.notes.NotesController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.notes',

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				root,
				name,
				disable;

			root = manager.getContent();
			name = btn.elementName;
			disable = root.getChildrenCountByProp('xmlTag', name);

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