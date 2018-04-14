/**
 * Контроллер кнопки изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.img.ImgController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.img',
		requires: [
			'FBEditor.view.window.img.Create'
		],

		onClick: function (button, e)
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				win,
				sel,
				range;

            if (e)
            {
                e.stopPropagation();
            }

			sel = manager.getSelection();

			if (sel)
			{
				win = btn.win || Ext.create('FBEditor.view.window.img.Create');

				// сохраняем данные текущего выделения
				range = sel.getRangeAt(0);
				win.selectionRange = {
					start: range.startContainer,
					offset: range.startOffset,
					oldValue: range.startContainer.nodeValue
				};

				btn.win = win;
				win.show();
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
				el,
				name,
				disable;

			el = manager.getFocusElement();

			if (!el)
			{
				btn.disable();

				return;
			}

			name = btn.elementName;
			disable = el.hisName(name);

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