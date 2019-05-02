/**
 * Контроллер кнопки элемента с возможностью переключения состояния.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.ToggleButtonController',
	{
		extend: 'FBEditor.editor.view.toolbar.button.ButtonController',
		alias: 'controller.editor.toolbar.button.togglebutton',

		onClick: function (button, e)
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				name,
				opts;

			if (e)
			{
				e.stopPropagation();
			}
			
			if (manager.isSuspendCmd())
			{
				return false;
			}
			
			name = btn.elementName;
			opts = btn.createOpts;

			if (!btn.pressed)
			{
				// если кнопка была отжата

				// удаляем элемент
				manager.deleteWrapper(name);
			}
			else
			{
				// создаем элемент
				manager.createElement(name, opts);
			}
		},

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				range,
				start,
				end,
				name,
				state;

			range = manager.getRange();

			if (!range)
			{
				me.verifyResult(false);
				//btn.disable();

				return;
			}

			start = range.start.getElement ? range.start.getElement() : manager.getFocusElement();
			end = range.end.getElement ? range.end.getElement() : start;
			name = btn.elementName;

			// состояние кнопки зависит от текущего выделения и его родителей
			state = (start.hisName(name) || start.hasParentName(name)) &&
			        (end.hisName(name) || end.hasParentName(name));

			// переключаем состояние
			btn.toggle(state);

			//console.log('state', state);

			me.verifyResult(true);
			//btn.enable();

			if (!state)
			{
				// активность кнопки для отжатого состояния
				if (!btn.isActiveSelection())
				{
					me.verifyResult(false);
					//btn.disable();
				}
				else
				{
					me.verifyResult(true);
					//btn.enable();
				}
			}
		}
	}
);