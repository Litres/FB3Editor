/**
 * Контроллер контейнера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.viewport.ViewportController',
	{
		extend: 'FBEditor.editor.view.viewport.ViewportController',
		alias: 'controller.main.editor.viewport',

		/**
		 * Синхронизирует скролл между окнами.
		 * @param {FBEditor.editor.view.viewport.Viewport} viewport Окно редактирования текста.
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