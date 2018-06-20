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
				buttons = view.getSyncButtons(),
				editor = view.getEditor(),
				manager = editor.getManager();

			if (buttons)
			{
				Ext.Array.each(
					buttons,
					function (item)
					{
						var btn;

						if (item)
						{
							if (Ext.isObject(item) && item.sequence)
							{
								if (!manager.availableSyncButtons())
								{
									Ext.each(
										item.sequence,
									    function (itemSeq)
									    {
										    btn = Ext.ComponentQuery.query(itemSeq)[0];
										    btn && btn.fireEvent('sync');
									    }
									);
								}
								else
								{
									// первая кнопка из однотипной последовательности
									btn = Ext.ComponentQuery.query(item.sequence[0])[0];

									// устанавливаем последовательность однотипных кнопок
									btn && btn.setSequence(item.sequence.slice(1));

									// синхронизируем
									btn && btn.fireEvent('sync');
								}
							}
							else
							{
								btn = Ext.ComponentQuery.query(item)[0];
								//console.log('btn', item, Ext.ComponentQuery.query(item));
								btn && btn.fireEvent('sync');
							}
						}
					}
				);
			}
		},

		/**
		 * Синхронизирует кнопки на адаптивной панели.
		 * @param {Object[]} [hiddenButtons] Кнопки на адпитвной панели.
		 */
		onSyncHiddenButtons: function (hiddenButtons)
		{
			var me = this,
				view = me.getView();

			hiddenButtons = hiddenButtons || view.getHiddenButtons();

			if (hiddenButtons)
			{
				Ext.Array.each(
					hiddenButtons,
					function (item)
					{
						item.fireEvent('sync');
					}
				);
			}
		},

		/**
		 * Деактивирует кнопки.
		 */
		onDisableButtons: function ()
		{
			var me = this,
				view = me.getView(),
				buttons = view.getSyncButtons();

			if (buttons)
			{
				Ext.Array.each(
					buttons,
					function (item)
					{
						var btn;
						
						if (item)
						{
							if (Ext.isObject(item) && item.sequence)
							{
								Ext.Array.each(
									item.sequence,
									function (itemSeq)
									{
										btn = Ext.ComponentQuery.query(itemSeq)[0];
										btn && btn.disable();
									}
								);
							}
							else
							{
								btn = Ext.ComponentQuery.query(item)[0];
								btn && btn.disable();
							}
						}
					}
				);
			}
		}
	}
);