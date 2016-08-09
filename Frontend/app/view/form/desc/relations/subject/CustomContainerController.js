/**
 * Контроллер контейнера данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.CustomContainerController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.container.custom',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView();

			view.setHidden(true);
		},

		/**
		 * Показывает или скрывает текущий контейнер и редактируемые поля.
		 * @param {Boolean} show Показывать ли контейнер.
		 */
		onShowCustom: function (show)
		{
			var me = this,
				view = me.getView();
			
			view.setVisible(show);
		},

		/**
		 * Показывает или скрывает редактируемые поля.
		 * @param {Boolean} stateCmp Показывать ли редактируемые поля.
		 */
		onShowEditor: function (stateCmp)
		{
			var me = this,
				view = me.getView(),
				customEditor;

			customEditor = view.getCustomEditor();

			// показываем или скрываем редактируемые поля
			customEditor.setVisible(stateCmp);
		},

		/**
		 * Показывает или скрывает краткую сводку.
		 * @param {Boolean} show Показывать ли сводку.
		 */
		onShowViewer: function (show)
		{
			var me = this,
				view = me.getView(),
				customViewer;

			customViewer = view.getCustomViewer();
			customViewer.setVisible(show);
		},

		/**
		 * Устанавливает состояние переключателя.
		 * @param {Boolean} state Сосотояние.
		 */
		onStateSwitcher: function (state)
		{
			var me = this,
				view = me.getView(),
				customViewer,
				switcher;

			customViewer = view.getCustomViewer();
			switcher = customViewer.getSwitcher();
			switcher.setStateCmp(state);
		}
	}
);