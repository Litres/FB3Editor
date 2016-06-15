/**
 * Контроллер кнопки notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.notes.NotesController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.notes',

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView();

			btn.enable();
		}
	}
);