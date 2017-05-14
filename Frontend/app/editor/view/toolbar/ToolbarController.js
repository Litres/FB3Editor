/**
 * Контроллер тулбара.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.ToolbarController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.editor.toolbar',

		/**
		 * Синхронизирует кнопки с выделением в тексте.
		 */
		onSyncButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtons(),
				toggleBtn = view.getToggleButton(),
				editor = view.getEditor(),
				manager = editor.getManager();
			
			if (buttons)
			{
				Ext.Array.each(
					buttons,
					function (btn)
					{
						var firstBtn;

						if (btn)
						{
							if (btn.sequence)
							{
								if (!manager.availableSyncButtons())
								{
									Ext.each(
										btn.sequence,
									    function (item)
									    {
										    item.fireEvent('sync');
									    }
									);
								}
								else
								{
									// первая кнопка из однотипной последовательности
									firstBtn = btn.sequence[0];

									// устанавливаем последовательность однотипных кнопок для первой кнопки
									firstBtn.setSequence(btn.sequence.slice(1));

									// синхронизируем
									firstBtn.fireEvent('sync');
								}
							}
							else
							{
								btn.fireEvent('sync');
							}
						}
					}
				);
			}

			toggleBtn.enable();
		},

		/**
		 * Деактивирует кнопки.
		 */
		onDisableButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtons(),
				toggleBtn = view.getToggleButton();

			if (buttons)
			{
				Ext.Array.each(
					buttons,
					function (btn)
					{
						if (btn)
						{
							if (btn.sequence)
							{
								Ext.Array.each(
									btn.sequence,
									function (seqBtn)
									{
										seqBtn.disable();
									}
								);
							}
							else
							{
								btn.disable();
							}
						}
					}
				);
			}

			toggleBtn.disable();
		}
	}
);