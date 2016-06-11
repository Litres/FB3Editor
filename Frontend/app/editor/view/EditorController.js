/**
 * Контроллер редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.EditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.view.editor',

		/**
		 * Загружает корневой элемент в редактор.
		 * @param {FBEditor.editor.element.root.RootElement} rootElement Корневой элемент.
		 */
		onLoadData: function (rootElement)
		{
			var me = this,
				view = me.getView(),
				viewport = view.getViewport(),
				manager = view.getManager(),
				node,
				viewportId;

			// айди окна
			viewportId = viewport.id;

			// создаем узел
			node = manager.getNode(viewportId);

			// загружаем узел в окно
			viewport.loadData(node);
		},

		/**
		 * Переключает на окно исходного xml.
		 */
		onSwitchToSource: function ()
		{
			var me = this,
				view = me.getView(),
				sourceViewport = view.getSourceViewport(),
				manager = view.getManager();

			sourceViewport.setVisible(true);
		},

		/**
		 * Переключает на окно обычного текста.
		 */
		onSwitchToText: function ()
		{
			var me = this,
				view = me.getView(),
				sourceViewport = view.getSourceViewport(),
				manager = view.getManager();

			sourceViewport.setHidden(true);
		}
	}
);