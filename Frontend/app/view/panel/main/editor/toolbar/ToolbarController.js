/**
 * Контроллер панели форматирования текста книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.ToolbarController',
	{
		extend: 'FBEditor.editor.view.toolbar.ToolbarController',

		alias: 'controller.main.editor.toolbar',
		
		onResize: function ()
		{
			var me = this,
				view = me.getView(),
				responsiveButton;

			// обновляем положение адаптивной панели
			responsiveButton = view.getResponsiveButton();
			responsiveButton.fireEvent('align');

			// обновляем кнопки на панели
			view.updateButtons();
		}
	}
);