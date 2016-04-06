/**
 * Контроллер вкладки форматирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.MainController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.main',

		/**
		 * Синхронизирует кнопки с выделением в тексте.
		 */
		onSyncButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtons();

			Ext.Array.each(
				buttons,
				function (btn)
				{
					var firstBtn;

					if (btn.sequence)
					{
						// первая кнопка из однотипной последовательности
						firstBtn = btn.sequence[0];

						// устанавливаем последовательность однотипных кнопок для первой кнопки
						firstBtn.setSequence(btn.sequence.slice(1));

						// синхронизируем
						firstBtn.fireEvent('sync');
					}
					else
					{
						btn.fireEvent('sync');
					}
				}
			);
		},

		/**
		 * Деактивирует кнопки.
		 */
		onDisableButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getButtons();

			Ext.Array.each(
				buttons,
				function (btn)
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
			);
		}
	}
);