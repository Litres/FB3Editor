/**
 * Контроллер кнопки заголовка для всей книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.titlebody.TitleBodyController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.titlebody',
		requires: [
			'FBEditor.view.window.img.Create'
		],

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
			disable = root.children[0].hisName(name);

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