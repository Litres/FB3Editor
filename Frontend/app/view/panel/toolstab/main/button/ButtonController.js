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

			manager.createElement(btn.elementName, btn.createOpts);
		},

		/**
		 * Синхронизирует состояние кнопки с текущим выделением.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager;

			if (!btn.isActiveSelection())
			{
				btn.disable();
			}
			else
			{
				btn.enable();
			}

			//console.log('sync', btn.elementName);
		},

		/**
		 * Проверяет получаемую схему.
		 * @param {String} xml Строка xml, новой проверяемой структуры.
		 * @return {Boolean}
		 */
		verify: function (xml, debug)
		{
			var manager = FBEditor.editor.Manager,
				sch = manager.getSchema(),
				res;

			res = sch.validXml(xml, debug);

			return res;
		}
	}
);