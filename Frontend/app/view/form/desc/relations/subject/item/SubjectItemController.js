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

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				values = view.getValues();

			if (!values)
			{
				// показываем поля поиска
				view.switchContainers(true);
			}
		},

		onLoadInnerData: function (data)
		{
			var me = this,
				view = me.getView(),
				btn,
				customContainer,
				searchContainer;

			btn = view.getCustomBtn();

			if (btn)
			{
				// скрываем поля поиска, показываем поля данных

				customContainer = view.getCustomContainer();
				searchContainer = view.getSearchContainer();

				customContainer.setVisible(true);

				customContainer.fireEvent('showViewer', true);
				customContainer.fireEvent('showEditor', false);

				searchContainer.setVisible(false);

				// меняем размер кнопок на меленький
				me.onResizeButtons(false);
			}
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