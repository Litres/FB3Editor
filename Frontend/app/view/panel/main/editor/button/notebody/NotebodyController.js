/**
 * Контроллер кнопки notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.notebody.NotebodyController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.notebody',

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
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