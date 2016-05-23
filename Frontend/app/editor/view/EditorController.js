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
		 * Загружает данные в окно редактора.
		 */
		onLoadData: function ()
		{
			var me = this,
				view = me.getView(),
				viewport = me.getViewport(),
				data;

			console.log('load', arguments);

			// получаем html
			//data = manager.getNode(item.id);

			//viewport.loadData(data);
		}
	}
);