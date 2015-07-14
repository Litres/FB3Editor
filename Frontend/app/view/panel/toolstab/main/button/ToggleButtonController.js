/**
 * Контроллер кнопки элемента с возможностью переключения состояния.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.ToggleButtonController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.togglebutton',

		onClick: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				name;

			name = btn.elementName;

			if (!btn.pressed)
			{
				// если кнопка была отжата

				// удаляем элемент
				manager.deleteWrapper(name);
			}
			else
			{
				// создаем элемент
				manager.createElement(name);
			}
		},

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				range,
				start,
				end,
				name,
				state;

			range = manager.getRange();
			start = range.start.getElement();
			end = range.end.getElement();
			name = btn.elementName;

			// состояние кнопки зависит от текущего выделения и его родителей
			state = (start.hisName(name) || start.hasParentName(name)) &&
			        (end.hisName(name) || end.hasParentName(name));

			//console.log(name, state, el);

			// переключаем состояние
			btn.toggle(state);
		}
	}
);