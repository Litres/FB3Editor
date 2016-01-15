/**
 * Контроллер окна с результатами поиска персон.
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
				input = view.inputField,
				panelPersons;

			// скрываем индикатор загрузки, который показывается по умолчанию в панели результатов
			data.hideLoadMask = true;

			panelPersons = view.getPanelPersons();

			// настраиваем индикатор загрузки
			panelPersons.setLoadMask(
				{
					msg: '',
					target: input,
					cls: 'mask-persons-loading',
					style: {
						width: input.getWidth() - 4 + 'px'
					}
				}
			);

			panelPersons.params = Ext.clone(data);
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
				view = me.getView(),
				posY = view.inputField.getY(),
				height = view.getHeight(),
				bodyHeight = Ext.getBody().getHeight();

			if (view.isVisible() && view.inputField && view.rendered)
			{
				if (bodyHeight - posY < height)
				{
					view.alignTo(view.inputField, 'tl', [0, -height]);
				}
				else
				{
					view.alignTo(view.inputField, 'bl', [0, 0]);
				}
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