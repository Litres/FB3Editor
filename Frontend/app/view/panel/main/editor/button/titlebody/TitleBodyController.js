/**
 * Контроллер кнопки заголовка для всей книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.titlebody.TitleBodyController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.titlebody',

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				root,
				first,
				name,
				disable;

			root = manager.getContent();
			name = btn.elementName;
			first = root.first();
			disable = first ? first.hisName(name) : true;

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