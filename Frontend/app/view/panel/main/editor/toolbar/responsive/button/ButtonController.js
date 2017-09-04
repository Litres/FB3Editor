/**
 * Контроллер адаптивной кнопки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.responsive.button.ButtonController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.main.editor.toolbar.responsive.button',

		onClick: function (button, e)
		{
			var me = this,
				view = me.getView(),
				responsivePanel;

			e.stopPropagation();
			e.preventDefault();

			// показываем адаптивную панель
			responsivePanel = view.getResponsivePanel();
			responsivePanel.show();
		},

		/**
		 * Вызывается при необходимости выровнять адаптивную панель.
		 */
		onAlign: function ()
		{
			var me = this,
				view = me.getView(),
				responsivePanel;

			responsivePanel = view.getResponsivePanel();
			responsivePanel.close();
		}
	}
);