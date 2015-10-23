/**
 * Контроллер окна с результатами поиска персон..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.searchName.resultContainer',

		/**
		 * Вызывается при выборе персоны из списка.
		 * @param {Object} data Данные персоны.
		 */
		onSelect: function (data)
		{},

		onLoadData: function (data)
		{
			var me = this,
				view = me.getView(),
				panelPersons;

			panelPersons = view.getPanelPersons();
			panelPersons.fireEvent('loadData', data);
		},

		/**
		 * Вызывается при клике на панели.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			var me = this;

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * Позиционирует окно относительно поля ввода.
		 */
		onAlignTo: function ()
		{
			var me = this,
				view = me.getView();

			if (view.isVisible() && view.inputField && view.rendered)
			{
				view.alignTo(view.inputField, 'tr', [-view.getWidth(), -view.getHeight()]);
			}
		},

		/**
		 * Вызывается при изменении размеров окна.
		 */
		onResize: function ()
		{
			var me = this,
				view= me.getView();

			me.onAlignTo();

			// предотвращаем скрытие окна
			view.isShow = false;
		}
	}
);