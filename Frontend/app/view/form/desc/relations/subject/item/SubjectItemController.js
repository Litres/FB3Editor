/**
 * Контроллер родительского контейнера каждой персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.item.SubjectItemController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.item',

		onLoadInnerData: function (data)
		{
			var me = this,
				view = me.getView(),
				customContainer;
			
			customContainer = view.getCustomContainer();
			customContainer.fireEvent('showViewer', true);
			customContainer.fireEvent('showEditor', false);
			
			// меняем размер кнопок на меленький
			me.onResizeButtons(false);
		},

		/**
		 * Изменяет размеры кнопок плагина.
		 * @param {Boolean} isBig Большие ли кнопки.
		 */
		onResizeButtons: function (isBig)
		{
			var me = this,
				view = me.getView(),
				plugin;

			plugin = view.getPlugin('fieldcontainerreplicator');

			// изменяем размер кнопок плагина
			plugin.setSizeButtons(isBig);
		},

		/**
		 * Вызывается после рендеринга контейнера плагина.
		 */
		onAfterRenderPlugin: function ()
		{
			//
		},

		onResetContainer: function ()
		{
			//
		}
	}
);