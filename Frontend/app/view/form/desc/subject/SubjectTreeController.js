/**
 * Контроллер панели дерева списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectTreeController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subjectTree',

		/**
		 * Вызывается при клике на панели дерева.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			var me = this;

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * @event selectSubject Выбрасывает событие по факту выбранного жанра.
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				view = me.getView(),
				subjectView,
				data;

			node.toggle(record);
			if (!record.isExpandable())
			{
				data = record.getData();
				subjectView = view.subjectView;
				subjectView.fireEvent('selectSubject', data);
				view.close();
			}
		}
	}
);