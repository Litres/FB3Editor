/**
 * Контроллер кнопки note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.note.NoteController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.note',

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				range,
				end,
				name,
				enable;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();

				return;
			}

			end = range.end.getElement ? range.end.getElement() : manager.getFocusElement();
			name = btn.elementName;

			// состояние кнопки
			enable = end.hisName('notes') || end.hasParentName(name);

			if (enable)
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