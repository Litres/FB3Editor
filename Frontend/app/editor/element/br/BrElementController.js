/**
 * Кнотроллер элемента br.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.br.BrElementController',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElementController',

		onKeyDownDefault: function (e)
		{
			var me = this,
				cmd;

			// вмешиваемся в событие нажатия клавиши, чтобы корректно заменить пустой элемент на пустой текст

			//return true;

			//console.log(e);

			/*
			if (!me.isSpecialKey(e))
			{
				// заменяем пустой элемент на пустой текст
				cmd = Ext.create('FBEditor.editor.command.br.CreateEmptyTextCommand');

				if (cmd.execute())
				{
					//
				}
			}
			*/

			return true;
		},

		/**
		 * Спициальная ли клавиша была нажата.
		 * @param {Object} evt Событие нажатой клавиши.
		 * @return {Boolean}
		 */
		isSpecialKey: function (evt)
		{
			var k = evt.keyCode,
				e = Ext.event.Event;

			return evt.ctrlKey ||
			       (k >= 33 && k <= 40) ||      // Page Up/Down, End, Home, Left, Up, Right, Down
			       k === e.RETURN ||
			       k === e.TAB ||
			       k === e.ESC ||
			       k === 91 ||                  // Win
			       k === 144 ||                 // Num Mode
			       k === 145 ||                 // Scroll Lock
			       k === e.CONTEXT_MENU ||      // Context Menu
			       (k === e.BACKSPACE) ||       // Backspace
			       (k >= 112 && k <= 123) ||    // F1-F12
			       (k >= 16 && k <= 20) ||      // Shift, Ctrl, Alt, Pause, Caps Lock
			       (k >= 44 && k <= 46);        // Print Screen, Insert, Delete
		}
	}
);