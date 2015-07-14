/**
 * Контроллер кнопки элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.ButtonController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.main.button',

		onClick: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager;

			manager.createElement(btn.elementName);
		},

		/**
		 * Синхронизирует состояние кнопки с текущим выделением.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager;

			//console.log('sync', btn.elementName);
		}
	}
);