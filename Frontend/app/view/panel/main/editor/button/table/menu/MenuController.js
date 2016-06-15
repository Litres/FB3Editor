/**
 * Контроллер меню для кнопки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.MenuController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.main.editor.button.table.menu',

		/**
		 * Синхронизирует пункты меню с контекстом редактора текста.
		 */
		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				menuItems;

			menuItems = view.query('main-editor-button-table-menu-item');

			Ext.Array.each(
				menuItems,
			    function (item)
			    {
				    item.fireEvent('sync');
			    }
			);
		}
	}
);