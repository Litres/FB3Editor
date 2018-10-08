/**
 * Контроллер кнопки создания элемента a.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.a.AController',
	{
		extend: 'FBEditor.editor.view.toolbar.button.ToggleButtonController',
		alias: 'controller.editor.toolbar.button.a',

		onClick: function ()
		{
			var me = this,
				btn = me.getView(),
				opts = btn.createOpts || {},
				href,
				text;

			if (btn.pressed)
			{
				// запрашиваем адрес

				text = btn.translateText.enterAddress;
				href = window.prompt(text, 'http://');
				
				if (!href)
				{
					btn.toggle();
					return;
				}
				
				// передаем в команду создания элемента необходимый аттрибут
				opts.attributes = opts.attributes || {};
				opts.attributes.href = href;
				btn.createOpts = opts;
			}

			me.callParent(arguments);
		}
	}
);