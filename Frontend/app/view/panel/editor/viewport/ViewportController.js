/**
 * Контроллер окна редактирования текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.ViewportController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.editor.viewport',

		/**
		 * Вызывается при изменении контента.
		 * @param {String} oldValue Старый контент.
		 * @param {String} newValue Новый контент.
		 */
		onChange: function (oldValue, newValue)
		{
			var me = this,
				view = me.getView(),
				editor;

			editor = Ext.getCmp('main-editor');
			editor.fireEvent('syncContent', view);
		},

		/**
		 * Синхронизирует скролл между окнами.
		 * @param {FBEditor.view.panel.editor.viewport.Viewport} viewport Окно редактирования текста.
		 */
		onSyncScroll: function (viewport)
		{
			var me = this,
				view = me.getView(),
				content = view.getContent(),
				contentSource = viewport.getContent(),
				scrollY = contentSource.scrollTop;

			content.scrollTop = scrollY + viewport.getHeight();
		}
	}
);