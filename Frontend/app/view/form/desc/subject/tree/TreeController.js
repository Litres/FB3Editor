/**
 * Контроллер панели дерева списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tree.TreeController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.form.desc.subject.tree',

		/**
		 * Вызывается при необходимотси отфильтровать дерево.
		 * @param {String} value Значение для фильтрации.
		 */
		onFilter: function (value)
		{
			var me = this,
				view = me.getView();

			view.filterData(value);
		},

		/**
		 * Вызывается при клике на панели дерева.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @event selectSubject Выбрасывает событие по факту выбранного жанра.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				subject = win.getSubject(),
				data,
				val;

			node.toggle(record);

			if (!record.isExpandable())
			{
				data = record.getData();
				val = data[view.displayField];

				// вырезаем теги жирности
				val = val.replace(/<\/?b>/ig, '');

				subject.fireEvent('selectSubject', val);

				// закрываем окно
				win.close();
			}
		}
	}
);